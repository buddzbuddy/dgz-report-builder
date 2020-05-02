import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem } from '../nav-item';
import { DataService } from '../data.service';
import { AppConfig } from '../app.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  @ViewChild('drawer', { static: true }) drawer: ElementRef;
  menuItems: MenuItem[] = [
    {
      "DisplayName":"Оставить заявку",
      "Route":"steppers/unemployee",
      "IconName":"queue"
    }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  projectName = 'ЖАРДАМ / COVID-19'//AppConfig.settings.dbPrefix.toUpperCase();
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dataSvc: DataService,
    public oauthService: OAuthService,
    private ref: ChangeDetectorRef
    ) {
     }
    ngOnInit(){
      this.dataSvc.getMenuItems().subscribe(data =>
        {
          if(this.oauthService.hasValidAccessToken()){
            this.menuItems = data.value;
            this.oauthService.loadUserProfile();
            this.ref.detectChanges();
          }
        });
    }

    isLoaded: boolean = false;
    get claims(): any {
      return this.oauthService.getIdentityClaims();
    }

  public login() {
    this.oauthService.initImplicitFlow();
    //this.oidcSecurityService.authorize();
  }

  public logoff() {
      this.oauthService.logOut();
      //this.oidcSecurityService.logoff();
  }
}
