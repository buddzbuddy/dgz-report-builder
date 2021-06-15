import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-role-constraints',
  templateUrl: './role-constraints.component.html',
  styleUrls: ['./role-constraints.component.scss']
})
export class RoleConstraintsComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private notificationSvc: NotificationService,) { }

  ngOnInit(): void {
    this.loadRoles();
    this.loadConstraints();
  }

  selectedSection = ''
  selectedRoleId = 0
  app_sections = [
    {
      val: SECTION_ANALYTICS,
      label: 'Аналитика'
    },
    {
      val: SECTION_REPORT,
      label: 'Конструктор запросов'
    },
    {
      val: SECTION_INTEGRATION,
      label: 'Интеграция'
    },
    {
      val: SECTION_PRIVACY,
      label: 'Конфиденциальность'
    },
    {
      val: SECTION_SCHEDULER,
      label: 'Планировщик'
    },
    {
      val: SECTION_USERS,
      label: 'Пользователи'
    }
  ];
  roles = []
  loadRoles() {
    const href = 'data-api/user-constraint/role/getAll';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.roles = _;
    });
  }

  loadConstraints() {
    const href = 'data-api/user-constraint/getAll';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.constraints = _;
    });
  }
  getSectionLabel(cardName): string {
    let res = '';
    this.app_sections.map(_ => {
      if (cardName == _.val) {
        res = _.label;
      }
    });
    return res;
  }
  getRoleLabel(roleId): string {
    let res = '';
    this.roles.map(_ => {
      if (roleId == _.id) {
        res = _.label;
      }
    });
    return res;
  }
  constraints = []
  createConstraint() {
    let obj = {
      roleId: this.selectedRoleId,
      cardName: this.selectedSection
    }
    this.selectedRoleId = 0;
    this.selectedSection = '';
    const href = 'data-api/user-constraint/create';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.loadConstraints();
    });
  }
  removeConstraint(id) {
    const href = 'data-api/user-constraint/delete/' + id;
    const requestUrl = `${href}`;
    this._httpClient.delete(AppConfig.settings.host + requestUrl, httpOptions).subscribe(_ => {
      this.loadConstraints();
    });
  }

  items = []
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const SECTION_ANALYTICS = 'analytics'
const SECTION_REPORT = 'report'
const SECTION_INTEGRATION = 'integration'
const SECTION_PRIVACY = 'privacy'
const SECTION_SCHEDULER = 'scheduler'
const SECTION_USERS = 'users'
