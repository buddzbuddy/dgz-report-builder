import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { DataService } from 'src/app/data.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { FieldConfig } from 'src/app/field.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
    private notificationSvc: NotificationService, private router: Router, private dataSvc: DataService, private oauthService: OAuthService) { }
  formGroup: FormGroup;
  personId: number = 0;
  RegDateField: FieldConfig = { type: 'date', name: 'RegDate', label: 'Дата постановки на учет' };
  ExpiryDateField: FieldConfig = { type: 'date', name: 'ExpiryDate', label: 'Дата снятия с учета' };
  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      ExpiryDate: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      RegDate: ''//['', Validators.required],
    });
    this.route.params.subscribe(params => {
      if (params['personId'] != null) {
        this.personId = params['personId'];
      }
    });
  }

  submit(){
    if(this.oauthService.hasValidAccessToken()) {
      var obj = {
        ...this.formGroup.value,
        PersonResourceId: this.personId,
        CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
        UserId: this.oauthService.getIdentityClaims()['sub']
      }
      //Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
      this.dataSvc.postODataResource("RegistrationResources", obj).subscribe((_) => {
        if(_.Id > 0){

        this.notificationSvc.success("Информация успешно добавлена!");

        this.router.navigate([`/living-persons/view/${this.personId}`]);
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
