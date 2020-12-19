import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-tenders',
  templateUrl: './view-tenders.component.html',
  styleUrls: ['./view-tenders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewTendersComponent implements OnInit {

  isLoadingResults: boolean = false;
  ngOnInit() {
    this.fetchTenders();
  }
  displayedColumns: string[] = ['tender_tenderNumber', 'date', 'tender_title', 'tender_status', 'contracts_length'];
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

  tenderInfoList: any = {}
  fetchTenders(){
    const href = '/api/tendering?&size=1000';
    const requestUrl = `${href}`;
    this.isLoadingResults = true;
    this._httpClient.get<any>(AppConfig.settings.host_tendering + requestUrl).subscribe(_ => {
      this.tenderInfoList = _;
      console.log(_);

      let rows = [];
      for (let index = 0; index < this.tenderInfoList.releases.length; index++) {
        const element = this.tenderInfoList.releases[index];
        rows.push({
          tender_tenderNumber: element.tender.tenderNumber,
          tender_title: element.tender.title,
          tender_status: element.tender.status,
          contracts_length: element.contracts != null ? element.contracts.length : 0,
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
      console.log(el);
    }
  }
}
