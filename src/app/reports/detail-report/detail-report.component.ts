import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment';
import { Observable, interval } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {

  constructor(private dataSvc: DataService) {
    this.now$ = interval(1000).pipe(
      startWith(null),
      map(() => new Date())
    );
   }
  
  ngOnInit() {
    this.getReportData();
  }
  now$: Observable<Date>;
  reportItems: any[] = []
  regionItems: any[] = []
  today: any;
  getReportData() {
    
    
    this.dataSvc.customApi_Patients_GetReportItems().subscribe(_ => {
      this.reportItems = _;
      this.today = moment(Date.now()).format('DD.MM.YYYY');
    });
    
    this.dataSvc.customApi_Patients_GetRegionItems().subscribe(_ => {
      this.regionItems = _;
    });
  }
}
