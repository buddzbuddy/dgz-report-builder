import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-sod-updater',
  templateUrl: './view-sod-updater.component.html',
  styleUrls: ['./view-sod-updater.component.scss']
})
export class ViewSodUpdaterComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private router: Router) { }

  ngOnInit() {
    //this.checkLoading();
  }
  checkLoading(){
    const href = '/api/AnalisingServices/IsLoading?pin=02406199910174';
    const requestUrl = `${href}`;
    this._httpClient.get<boolean>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.isLoading = _;
      console.log(_);
    });
  }
  isLoading = false;
  result = {ip_infos:0,pension_infos:0}
  start(){
    if(this.isLoading) return;
    this.isLoading = true;


    this.updateMsecData();
    setTimeout(() => {
      this.isLoading = false;
      this.result.ip_infos = 14;
      this.result.pension_infos = 3;
    }, 5000);
    /*
    const href = '/api/AnalisingServices/UpdateSODData?sti=true&sf=true&pin=02406199910174';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.isLoading = false;
      this.result = _;
    });*/
  }

  downloadTemplate(code: number) {
    if(code == 1) {
      window.location.assign(AppConfig.settings.host + 'data-api/query/download/license');
    }
    else if(code == 2) {
      window.location.assign(AppConfig.settings.host + 'data-api/query/download/debt');
    }
    else if(code == 3) {
      window.location.assign(AppConfig.settings.host + 'data-api/query/download/supplierone');
    }
    else {
      alert("Отсутствует шаблон для данного источника!");
    }
  }

  goBack(){
    window.history.back();
  }

  msecDataResult: any
  isMsecLoading = false
  updateMsecData() {
    this.isMsecLoading = true;
    this._httpClient.get(AppConfig.settings.host + 'data-api/supplier-requests/initMsecDataAll').subscribe(_ => {
      this.isMsecLoading = false;
      this.msecDataResult = _;
    });
  }

  public licenseUploadResult: any
  public licenseProgress: number;
  public uploadLicenseFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.licenseUploadResult = null;
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this._httpClient.post(AppConfig.settings.host + 'data-api/query/upload/license', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.licenseProgress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.licenseUploadResult = event.body;
          files = []
        }
      });
  }

  public debtUploadResult: any
  public debtProgress: number;
  public uploadDebtFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.debtUploadResult = null;
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this._httpClient.post(AppConfig.settings.host + 'data-api/query/upload/debt', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.debtProgress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.debtUploadResult = event.body;
          files = []
        }
      });
  }

  public supplieroneUploadResult: any
  public supplieroneProgress: number;
  public uploadSupplieroneFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.supplieroneUploadResult = null;
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this._httpClient.post(AppConfig.settings.host + 'data-api/query/upload/supplierone', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.supplieroneProgress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.supplieroneUploadResult = event.body;
          files = []
        }
      });
  }
}
