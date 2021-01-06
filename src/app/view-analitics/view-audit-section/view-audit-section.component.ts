import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-audit-section',
  templateUrl: './view-audit-section.component.html',
  styleUrls: ['./view-audit-section.component.scss']
})
export class ViewAuditSectionComponent implements OnInit {

  constructor(private _httpClient: HttpClient, ) { }

  ngOnInit() {
    this.getMethod_types();
    this.getLogs();
  }
  isLoading = false;
  requests = []
  getLogs(){
    this.isLoading = true;

    const href = '/logs';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host_logs + requestUrl).subscribe(_ => {
      this.isLoading = false;
      this.requests = _;
    });
  }
  method_types: any[] = [];
  getMethod_types(){
    const href = '/api/audit_method_types?pin=02406199910174';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host_kong + "/dgz-kong-api" + requestUrl).subscribe(_ => {
      this.method_types = _;
      console.log(_);
    });
  }
  getMethodName(code: string) {
    let n = code;

    if(this.method_types.length > 0){
      for (let index = 0; index < this.method_types.length; index++) {
        const element = this.method_types[index];
        if(element.code == code) {
          n = element.name;
        }
      }
    }

    return n;
  }
  goBack(){
    window.history.back();
  }
  sortBy(prop: string) {
    return this.requests.sort((a, b) => a[prop] < b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }
}
