import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AppConfig } from 'src/app/app.config';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-supplier-account',
  templateUrl: './supplier-account.component.html',
  styleUrls: ['./supplier-account.component.scss']
})
export class SupplierAccountComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private readonly keycloak: KeycloakService,) { }
  public isLoggedIn = false;
  //public userProfile: KeycloakProfile | null = null;
  public userToken: string
  supplier
  supplierId = 0
  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      //this.userProfile = await this.keycloak.loadUserProfile();
      this.userToken = await this.keycloak.getToken();
      this.getSupplierByUserId();
    }
  }
  hasInit = false
  getSupplierByUserId() {
    let uObj = this.getDecodedAccessToken(this.userToken);
    const href = 'data-api/supplier-requests/getSupplierByUserId/' + uObj.sub;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      console.log(_);
      this.supplier = _;
      this.hasInit = true;
      this.supplierId = _.id
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
}
