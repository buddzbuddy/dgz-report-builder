import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-view-privacy-settings',
  templateUrl: './view-privacy-settings.component.html',
  styleUrls: ['./view-privacy-settings.component.scss']
})
export class ViewPrivacySettingsComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private notificationSvc: NotificationService,) { }
  licenseChecked = false;
  licenseChanged(event) {
    if (event.checked) {
      this.grantSource('LICENSE');
    }
    else {
      this.denySource('LICENSE');
    }
  }

  debtChecked = false;
  debtChanged(event) {
    if (event.checked) {
      this.grantSource('DEBT');
    }
    else {
      this.denySource('DEBT');
    }
  }
  ngOnInit() {
    this.getGrantedSources();
  }

  goBack() {
    window.history.back();
  }

  unknownChecked = false;
  unknownChanged(event) {
    this.unknownChecked = !event.checked;
    this.notificationSvc.warn('Подключение отсутствует');
  }

  getGrantedSources() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, { rootName: 'GrantedSource' }).subscribe(_ => {
      if (_['data'] != null) {
        let grantedSources: any[] = _['data'];
        for (let index = 0; index < grantedSources.length; index++) {
          const gSource = grantedSources[index];
          if (gSource.sourceType == 'LICENSE') {
            this.licenseChecked = true;
          }
          if (gSource.sourceType == 'DEBT') {
            this.debtChecked = true;
          }
        }
      }
    })
  }

  grantSource(source) {
    const href = 'data-api/query/grant-source';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, { sourceType: source }).subscribe(_ => {
      this.notificationSvc.success(_['message']);
    })
  }
  denySource(source) {
    const href = 'data-api/query/deny-source';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, { sourceType: source }).subscribe(_ => {
      this.notificationSvc.success(_['message']);
    })
  }
}
