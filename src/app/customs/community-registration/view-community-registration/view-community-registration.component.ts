import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-community-registration',
  templateUrl: './view-community-registration.component.html',
  styleUrls: ['./view-community-registration.component.scss']
})
export class ViewCommunityRegistrationComponent implements OnInit {
  @Input() personId: number = 0
  constructor(private dataSvc: DataService) { }

  registrationInfo: any = null;
  ngOnInit() {
    this.dataSvc.filterODataResourceExpanded('CommunityRegistrationResources', `$filter=PersonResourceId eq ${this.personId}`).subscribe(_ => {
      if(_.value) {
        this.registrationInfo = _.value[0];
      }
    });
  }

  delete(){
    if(this.registrationInfo) {
      this.dataSvc.deleteODataResource('CommunityRegistrationResources', this.registrationInfo.Id).subscribe(_ => {
        this.registrationInfo = null;
      });
    }
  }
}
