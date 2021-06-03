import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/data.service';

import * as moment from 'moment';
import { NotificationService } from 'src/app/notification.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-user-card',
  templateUrl: './view-user-card.component.html',
  styleUrls: ['./view-user-card.component.scss']
})
export class ViewUserCardComponent implements OnInit {
  resetFormSubject: Subject<boolean> = new Subject<boolean>();
  constructor(private _formBuilder: FormBuilder, private dataSvc: DataService,
    private notificationSvc: NotificationService, ) { }
  formGroup: FormGroup;
  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      FullName: '',//['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      GOM: '',//['', Validators.required],
      UVD: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      ServicePhone: '',//['', Validators.required],
      MobilePhone: '',
      AdmissionDays: ''
    });
    this.loadProfile();
  }
  loadProfile() {
    if(true) {
      let userId = '';
      this.dataSvc.filterODataResource('ProfileCardResources', `$filter=UserId+eq+${userId}`).subscribe(_ => {
        if(_.value.length) {
          this.hasProfile = true;
          this.cardId = _.value[0].Id;
        }
      });
      this.isLoggedIn = true;
    }
    else
    {
      this.notificationSvc.warn('Пользователь не вошел в систему!');
    }
  }
  hasProfile: boolean = false;
  cardId: number = 0;
  isLoggedIn: boolean = false;
  submit(){
    if(true) {
      var obj = {
        ...this.formGroup.value,
        CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),

      }
      //Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
      this.dataSvc.postODataResource("ProfileCardResources", obj).subscribe((_) => {
        if(_.Id > 0){
          this.loadProfile();
          this.notificationSvc.success("Профиль успешно заполнен!");

        }
        else {
          this.notificationSvc.warn('Что-то пошло не так ((');
        }
      });
    }
    else
    {
      this.notificationSvc.warn('Пользователь не вошел в систему!');
    }
  }
}
