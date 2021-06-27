import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-view-references',
  templateUrl: './view-references.component.html',
  styleUrls: ['./view-references.component.scss']
})
export class ViewReferencesComponent implements OnInit {

  constructor(private _httpClient: HttpClient,
    private notificationSvc: NotificationService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
  }
  goBack() {
    window.history.back();
  }
  entity
  selected(r: any) {
    this.entity = r;
    let obj = {
      rootName: r.name
    }
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.entries = _['data'];
    });
  }

  addEntry() {
    const dialogRef = this.dialog.open(AddReferenceDialog, {
      data: {
        data: this.entity,
        actionType: 'create',
        value: ''
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.selected(this.entity);
      }
    });
  }
  editEntry(r) {
    const dialogRef = this.dialog.open(AddReferenceDialog, {
      data: {
        data: this.entity,
        actionType: 'edit',
        id: r.id,
        value: r.name
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.selected(this.entity);
      }
    });
  }
  remove(id) {
    if (confirm('Вы уверены что хотите удалить запись?')) {
      const href = `data-api/query/delete/${this.entity.name}/${id}`;
      const requestUrl = `${href}`;
      this._httpClient.get<boolean>(AppConfig.settings.host + requestUrl).subscribe(_ => {
        if (_) {
          this.notificationSvc.success('Запись успешно удалена!');
          this.selected(this.entity);
        }
        else {
          this.notificationSvc.warn('Что-то пошло не так!');
        }
      });
    }
  }
  entries = []
  referenceTypes = [
    {
      label: 'Тип лицензии',
      name: 'LicenseType'
    },
    {
      label: 'Тип жалобы',
      name: 'ComplaintType'
    },
    {
      label: 'Отрасль',
      name: 'Industry'
    },
    {
      label: 'Тип собственности',
      name: 'OwnershipType'
    },
    {
      label: 'Тип участника',
      name: 'MemberType'
    },
    {
      label: 'Страна',
      name: 'Country'
    },
    {
      label: 'Валюта',
      name: 'Currency'
    },
  ]
}


@Component({
  selector: 'add-reference-dialog',
  templateUrl: 'add-reference-dialog.html',
})
export class AddReferenceDialog {
  constructor(
    public dialogRef: MatDialogRef<AddReferenceDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient,
    private notificationSvc: NotificationService) { }
  onSaveClick(): void {
    this.save();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  save() {
    let action = this.data.actionType == 'edit' ? `update/${this.data.id}` : 'insert'
    const href = `data-api/query/${action}`;
    const requestUrl = `${href}`;
    let obj = {
      entityName: this.data.data.name,
      fields: [
        {
          name: 'name',
          val: this.data.value
        }
      ]
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if (_) {
        this.notificationSvc.success('Запись успешно сохранена!');
        this.dialogRef.close(_);
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так!');
      }
    });
  }
}
