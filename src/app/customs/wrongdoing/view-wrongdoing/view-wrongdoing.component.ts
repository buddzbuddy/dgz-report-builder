import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-wrongdoing',
  templateUrl: './view-wrongdoing.component.html',
  styleUrls: ['./view-wrongdoing.component.scss']
})
export class ViewWrongdoingComponent implements OnInit {
  @Input() personId: number = 0
  constructor(private dataSvc: DataService) { }

  wrongdoingInfo: any = null;
  ngOnInit() {
    this.dataSvc.filterODataResourceExpanded('WrongdoingResources', `$filter=PersonResourceId eq ${this.personId}`).subscribe(_ => {
      if(_.value) {
        this.wrongdoingInfo = _.value[0];
      }
    });
  }

  delete(){
    if(this.wrongdoingInfo) {
      this.dataSvc.deleteODataResource('WrongdoingResources', this.wrongdoingInfo.Id).subscribe(_ => {
        this.wrongdoingInfo = null;
      });
    }
  }
}
