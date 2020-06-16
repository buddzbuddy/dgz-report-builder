import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/notification.service';
export interface DialogData {
  reason: string;
  isRejected: boolean
}
const app_view_weapon = 'app-view-weapon';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  resetFormSubject: Subject<boolean> = new Subject<boolean>();
  constructor(private route: ActivatedRoute,
    private dataSvc: DataService,
    public dialog: MatDialog,
    private notificationSvc: NotificationService,)
  { }
  appId: number = 0
  ngOnInit() {
    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['appId'] != null) {
          this.appId = params['appId'];
          this.getMyCategories();
          this.getFamily();
        }
      });
    }
  }

  hasWeaponCategory: boolean = false;

  displayedColumns: string[] = ['Name','action'];
  myCategories: any[]
  getMyCategories() {
    this.hasWeaponCategory = false;
    this.dataSvc.filterODataResource('PersonCategoryRefResources', `$filter=PersonResourceId eq ${this.appId}`).subscribe(_ => {
      if(_.value) {
        let existingCats = '';
        _.value.forEach(refItem => {
          existingCats += `,${refItem.CategoryResourceId}`
        });
        if(existingCats.length) {
          this.dataSvc.filterODataResource('CategoryResources', `$filter=Id in (${existingCats.substring(1)})`).subscribe(_ => {
            this.myCategories = _.value;
            _.value.forEach(refItem => {
              if(refItem.RouteName === app_view_weapon) this.hasWeaponCategory = true;
            });
          });
        } else {
          this.myCategories = [];
        }
      }
      else {
        this.myCategories = [];
      }
    })
  }
  delete(catId) {
    if(confirm('Вы уверены что хотите удалить эту запись?')){
      this.dataSvc.filterODataResource('PersonCategoryRefResources', `$filter=PersonResourceId eq ${this.appId} and CategoryResourceId eq ${catId}`).subscribe(_ => {

        if(_.value.length)
        {
          this.dataSvc.deleteODataResource('PersonCategoryRefResources', _.value[0].Id).subscribe(s => {
            this.notificationSvc.success('Удалено успешно!');
            this.getMyCategories()
          });
        }
        else {
          this.getMyCategories()
        }
      });
    }
  }
  deleteFMem(memId) {
    if(confirm('Вы уверены что хотите удалить эту запись?')){
      this.dataSvc.deleteODataResource('FamilyMemberResources', memId).subscribe(s => {
        this.notificationSvc.success('Удалено успешно!');
        this.getFamily();
      });
    }
  }

  myFamily: any[] = []
  displayedColumns2: string[] = ['PIN', 'FullName', 'RelationTypeResource', 'action'];
  getFamily(){
    this.dataSvc.filterODataResourceExpanded('FamilyMemberResources', `$filter=PersonResourceId eq ${this.appId}`).subscribe(_ => {
      this.myFamily = _.value;
    });
  }
}