import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AppConfig } from 'src/app/app.config';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-buyer-account',
  templateUrl: './buyer-account.component.html',
  styleUrls: ['./buyer-account.component.scss']
})
export class BuyerAccountComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private readonly keycloak: KeycloakService,) { }
  public isLoggedIn = false;
  //public userProfile: KeycloakProfile | null = null;
  public userToken: string
  buyer
  buyerId = 0
  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      //this.userProfile = await this.keycloak.loadUserProfile();
      this.userToken = await this.keycloak.getToken();
      this.getBuyerByUserId();
    }
  }
  getBuyerByUserId() {
    let uObj = this.getDecodedAccessToken(this.userToken);
    const href = 'data-api/supplier-requests/getBuyerByUserId/' + uObj.sub;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      console.log(_);
      this.buyer = _;
      this.buyerId = _.id
    });
  }
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
  editing = false;
  editObj
  edit() {
    this.editObj = {
      ...this.buyer
    }
    this.editing = true;
  }
  cancel() {
    this.editing = false;
  }
}
