import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-view-procurements',
  templateUrl: './view-procurements.component.html',
  styleUrls: ['./view-procurements.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewProcurementsComponent implements OnInit {

  isLoadingResults: boolean = false;
  ngOnInit() {
    this.fetchProcurements();
  }
  displayedColumns: string[] = ['tender_tenderNumber', 'tenderDatePublished', 'tender_title', 'tender_status'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  constructor(private _httpClient: HttpClient) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  procurementInfoList: any = {}
  fetchProcurements(){
    this.isLoadingResults = true;
    const href = '/api/export/json?from=2020-12-05&to=2020-12-17';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host_analitics + requestUrl).subscribe(_ => {
      this.procurementInfoList = _;
      console.log(_);

      let rows = [];
      for (let index = 0; index < this.procurementInfoList.releases.length; index++) {
        const element = this.procurementInfoList.releases[index];
        rows.push({
          tender_tenderNumber: element.tender.tenderNumber,
          tender_title: element.tender.title,
          tender_status: element.tender.status,
          ...element
        });
      }
      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (row, filter) => {

        return this.displayedColumns.some(colName => {
          return (row[colName] && row[colName].toString().toLowerCase().indexOf(filter) != -1);
        });
      };

      this.isLoadingResults = false;
    });
  }

  expandedElement: any;

  expand(el){
    this.expandedElement = el;
    if(el != null){
      console.log(el.tender.title);
    }
  }
}
