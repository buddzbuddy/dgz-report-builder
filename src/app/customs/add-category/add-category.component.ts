import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private dataSvc: DataService) { }
  personId: number = 0;
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['personId'] != null) {
        this.personId = params['personId'];
        this.getCategories();
      }
    });
  }
  displayedColumns: string[] = ['Name'];
  categories: any[]
  getCategories() {
    this.dataSvc.filterODataResource('PersonCategoryRefResources', `$filter=PersonResourceId eq ${this.personId}`).subscribe(_ => {
      if(_.value) {
        let existingCats = '';
        _.value.forEach(refItem => {
          existingCats += ` and Id ne ${refItem.CategoryResourceId}`
        });
        if(existingCats.length) {
          this.dataSvc.filterODataResource('CategoryResources', `$filter=${existingCats.substring(5)}`).subscribe(_ => {
            this.categories = _.value
          });
        }
        else {
          this.dataSvc.getODataResource('CategoryResources').subscribe(_ => {
            this.categories = _.value
          });
        }
      }
    })

  }
  select(catId) {
    //console.log(catId)
    let refObj = {
      CategoryResourceId: catId,
      PersonResourceId: this.personId
    };
    this.dataSvc.postODataResource('PersonCategoryRefResources', refObj).subscribe(_ => {
      this.router.navigate(['/living-persons/view/' + this.personId]);
    })
  }
}
