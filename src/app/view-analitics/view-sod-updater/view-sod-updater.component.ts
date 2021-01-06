import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-sod-updater',
  templateUrl: './view-sod-updater.component.html',
  styleUrls: ['./view-sod-updater.component.scss']
})
export class ViewSodUpdaterComponent implements OnInit {

  constructor(private _httpClient: HttpClient, ) { }

  ngOnInit() {
    this.checkLoading();
  }
  checkLoading(){
    const href = '/api/AnalisingServices/IsLoading?pin=02406199910174';
    const requestUrl = `${href}`;
    this._httpClient.get<boolean>(AppConfig.settings.host_kong + "/dgz-kong-api" + requestUrl).subscribe(_ => {
      this.isLoading = _;
      console.log(_);
    });
  }
  isLoading = false;
  result = {ip_infos:0,pension_infos:0}
  start(){
    if(this.isLoading) return;
    this.isLoading = true;

    const href = '/api/AnalisingServices/UpdateSODData?sti=true&sf=true&pin=02406199910174';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host_kong + "/dgz-kong-api" + requestUrl).subscribe(_ => {
      this.isLoading = false;
      this.result = _;
    });
  }
}
