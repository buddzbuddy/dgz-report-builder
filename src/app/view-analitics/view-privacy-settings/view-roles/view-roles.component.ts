import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-view-roles',
  templateUrl: './view-roles.component.html',
  styleUrls: ['./view-roles.component.scss']
})
export class ViewRolesComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private notificationSvc: NotificationService,) { }

  ngOnInit(): void {
    this.loadRoles();
  }
  roles = []
  loadRoles() {
    const href = 'data-api/user-constraint/role/getAll';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.roles = _;
    });
  }
  name = ''
  label = ''
  createRole() {
    let obj = {
      name: this.name,
      label: this.label
    }
    this.name = '';
    this.label = '';
    const href = 'data-api/user-constraint/role/create';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.loadRoles();
    });
  }
  removeRole(id) {
    const href = 'data-api/user-constraint/role/delete/' + id;
    const requestUrl = `${href}`;
    this._httpClient.delete(AppConfig.settings.host + requestUrl, httpOptions).subscribe(_ => {
      this.loadRoles();
    });
  }
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
