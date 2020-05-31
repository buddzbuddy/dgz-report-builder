import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-weapon',
  templateUrl: './view-weapon.component.html',
  styleUrls: ['./view-weapon.component.scss']
})
export class ViewWeaponComponent implements OnInit {
  @Input() personId: number = 0
  constructor(private dataSvc: DataService) { }

  weaponInfo: any = null;
  ngOnInit() {
    this.dataSvc.filterODataResourceExpanded('PersonWeaponResources', `$filter=PersonResourceId eq ${this.personId}`).subscribe(_ => {
      if(_.value) {
        this.weaponInfo = _.value[0];
      }
    });
  }

  delete(){
    if(this.weaponInfo) {
      this.dataSvc.deleteODataResource('PersonWeaponResources', this.weaponInfo.Id).subscribe(_ => {
        this.weaponInfo = null;
      });
    }
  }

}
