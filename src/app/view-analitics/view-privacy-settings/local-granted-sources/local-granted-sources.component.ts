import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-local-granted-sources',
  templateUrl: './local-granted-sources.component.html',
  styleUrls: ['./local-granted-sources.component.scss']
})
export class LocalGrantedSourcesComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private notificationSvc: NotificationService,) { }

  ngOnInit() {
    this.fetchGrantedData();
  }
  inn = ''
  items = []
  foundSuppliers = []
  findByInn() {
    if(this.inn.length > 0) {
      //console.log(this.inn);
      this.fetchDataByInn();
    }
  }
  fetchDataByInn() {
    const href = `data-api/query/exec`;
    const requestUrl = `${href}`;
    let obj = {
      rootName: 'Supplier',
      searchFitler: [{
        property: 'inn',
        operator: '=',
        value: this.inn
      }]
    }
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if(_.result) {
        this.foundSuppliers = _.data;
      }
    });
  }

  fetchGrantedData() {
    const href = `data-api/query/get-granted-sources/`;
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.items = _;
    });
  }

  licenseChanged(event) {
    if(event.checked) {
      this.grantSource('LICENSE', this.inn);
    }
    else {
      this.denySource('LICENSE', this.inn);
    }
  }

  debtChecked = false;
  debtChanged(event) {
    if(event.checked) {
      this.grantSource('DEBT', this.inn);
    }
    else {
      this.denySource('DEBT', this.inn);
    }
  }

  grantSource(sourceType, supplierInn) {
    const href = 'data-api/query/grant-source-local';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, {sourceType, supplierInn}).subscribe(_ => {
      this.notificationSvc.success(_['message']);
      this.fetchGrantedData();
    })
  }
  denySource(sourceType, supplierInn) {
    const href = 'data-api/query/deny-source-local';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, {sourceType, supplierInn}).subscribe(_ => {
      this.notificationSvc.success(_['message']);
      this.fetchGrantedData();
    })
  }

  getSourceTypeName(sourceType) : string {
    let sourceTypeName = '';
    if(sourceType == 'LICENSE') {
      sourceTypeName = 'Лицензии';
    }
    if(sourceType == 'DEBT') {
      sourceTypeName = 'Задолженность ГНС';
    }
    return sourceTypeName;
  }
}
