import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-supplier-appeals',
  templateUrl: './view-supplier-appeals.component.html',
  styleUrls: ['./view-supplier-appeals.component.scss']
})
export class ViewSupplierAppealsComponent implements OnInit {

  constructor(private _httpClient: HttpClient) { }
  @Input() supplierId: number = 0;
  ngOnInit() {
    this.fetchAppeals();
  }
  appeals: any[] = []
  fetchAppeals(){
    const href = '/api/appeals/GetBySupplier?supplier='+this.supplierId;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.appeals = _;
    });
  }

}
