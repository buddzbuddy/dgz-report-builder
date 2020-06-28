import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-identity-card',
  templateUrl: './view-identity-card.component.html',
  styleUrls: ['./view-identity-card.component.scss']
})
export class ViewIdentityCardComponent implements OnInit {
  @Input() personId: number = 0
  constructor(private dataSvc: DataService) { }

  identityCardInfo: any = null;
  ngOnInit() {
    this.dataSvc.filterODataResourceExpanded('IdentityCardResources', `$filter=PersonResourceId eq ${this.personId}`).subscribe(_ => {
      if(_.value) {
        this.identityCardInfo = _.value[0];
      }
    });
  }

  delete(){
    if(this.identityCardInfo) {
      this.dataSvc.deleteODataResource('IdentityCardResources', this.identityCardInfo.Id).subscribe(_ => {
        this.identityCardInfo = null;
      });
    }
  }
}
