import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { Component } from '@angular/core';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private oauthService: OAuthService) {
    this.configureWithNewConfigApi();
  }
  private configureWithNewConfigApi() {
    //this.oauthService.configure(AppConfig.authConfig);
    //this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    /*this.oauthService.loadDiscoveryDocumentAndLogin({
      preventClearHashAfterLogin: true
    });*///Login requied
    //this.oauthService.loadDiscoveryDocumentAndTryLogin();//Login not required, call by click "Login" button
  }
}
