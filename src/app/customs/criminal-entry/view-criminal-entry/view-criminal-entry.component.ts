import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-criminal-entry',
  templateUrl: './view-criminal-entry.component.html',
  styleUrls: ['./view-criminal-entry.component.scss']
})
export class ViewCriminalEntryComponent implements OnInit {
  @Input() personId: number = 0
  constructor(private dataSvc: DataService) { }

  criminalInfo: any = null;
  ngOnInit() {
    this.dataSvc.filterODataResourceExpanded('CriminalEntryResources', `$filter=PersonResourceId eq ${this.personId}`).subscribe(_ => {
      if(_.value) {
        this.criminalInfo = _.value[0];
      }
    });
  }

  delete(){
    if(this.criminalInfo) {
      this.dataSvc.deleteODataResource('CriminalEntryResources', this.criminalInfo.Id).subscribe(_ => {
        this.criminalInfo = null;
      });
    }
  }

}
