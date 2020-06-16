import { OAuthService } from 'angular-oauth2-oidc';
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from "rxjs";

import { CamundaRestService } from '../camunda-rest.service'
import { Router } from '@angular/router';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  url = AppConfig.settings.dashboardUrl;//'http://localhost/mvd_dashboard/#/dashboard';
  private fileToUpload: File = null;
  private SUCCESS: boolean = false;
  constructor(private camundaRestService: CamundaRestService,
    private oauthService: OAuthService,
    private httpClient: HttpClient,
    private router: Router,) {
    }
  isLoaded: boolean = false;
  loadClaims(){
    this.claims = this.oauthService.getIdentityClaims();
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.camundaRestService.deployProcess(this.fileToUpload).subscribe(data => {
      this.SUCCESS = true;
      }, error => {
        console.log(error);
    });
  }
  public isHidden: boolean = false;
  toggle(){
    this.isHidden = !this.isHidden;
    this.loadClaims()
  }
  claims: any = null
  apiData : any = null;
  callApi1() {
      this.httpClient.get('http://localhost:5001/api/identity').subscribe(data => {
        this.apiData = data;
      });
  }
  callApi2() {
      this.httpClient.get('http://localhost:5001/api/content').subscribe(data => {
        this.apiData = data;
      });
  }
}
