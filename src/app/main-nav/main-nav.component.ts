import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
export class MainNavComponent implements AfterViewInit {
  @ViewChild('drawer', { static: true }) drawer: ElementRef;
  menuItems: MenuItem[] = [

  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => true/*result.matches*/)
    );
  projectName = AppConfig.settings.dbPrefix.toUpperCase();
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dataSvc: DataService,
    public oauthService: OAuthService,
    private ref: ChangeDetectorRef
    ) {
     }
    ngAfterViewInit(){
      setTimeout(() =>{
        this.menuItems.push({ DisplayName: 'Статистика', Route: 'reports/detail-report', IconName: 'list' });
      this.dataSvc.getMenuItems().subscribe(data =>
        {
          //this.menuItems = data.value;
          if(this.oauthService.hasValidAccessToken()){
            this.menuItems = data.value;
            this.oauthService.loadUserProfile();
            this.ref.markForCheck();
          }
        });
      }, 1000);
    }

    isLoaded: boolean = false;
    get claims(): any {
      return this.oauthService.getIdentityClaims();
    }

  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logoff() {
      this.oauthService.logOut();
  }
}
