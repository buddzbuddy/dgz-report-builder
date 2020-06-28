import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-registration',
  templateUrl: './view-registration.component.html',
  styleUrls: ['./view-registration.component.scss']
})
export class ViewRegistrationComponent implements OnInit {
  @Input() personId: number = 0
  constructor(private dataSvc: DataService) { }

  registrationInfo: any = null;
  ngOnInit() {
    this.dataSvc.filterODataResourceExpanded('RegistrationResources', `$filter=PersonResourceId eq ${this.personId}`).subscribe(_ => {
      if(_.value) {
        this.registrationInfo = _.value[0];
      }
    });
  }

  delete(){
    if(this.registrationInfo) {
      this.dataSvc.deleteODataResource('RegistrationResources', this.registrationInfo.Id).subscribe(_ => {
        this.registrationInfo = null;
      });
    }
  }
}
