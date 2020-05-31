import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { NotificationService } from 'src/app/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment';
import { FieldConfig } from 'src/app/field.interface';

@Component({
  selector: 'app-create-weapon',
  templateUrl: './create-weapon.component.html',
  styleUrls: ['./create-weapon.component.scss']
})
export class CreateWeaponComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
    private notificationSvc: NotificationService, private router: Router, private dataSvc: DataService, private oauthService: OAuthService) { }
  formGroup: FormGroup;
  personId: number = 0;
  field: FieldConfig = { type: 'date', name: 'ReleaseDate', label: 'Дата выпуска' };
  ngOnInit() {
    this.loadWeapons();
    this.formGroup = this._formBuilder.group({
      WeaponResourceId: '',//['', Validators.required],
      PermitNumber: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      Mark: '',//['', Validators.required],
      Caliber: '',
      NumberTrunks: '',
      ChargeNumber: '',
      IssuedBy: '',
      ReleaseDate: ''
    });
    this.route.params.subscribe(params => {
      if (params['personId'] != null) {
        this.personId = params['personId'];
      }
    });
  }
  weapons: any[] = [];
  loadWeapons(){
    this.dataSvc.getODatatResourceExpanded('WeaponTypeResources').subscribe((_) => {
      this.weapons = _.value;
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
      this.dataSvc.postODataResource("PersonWeaponResources", obj).subscribe((_) => {
        if(_.Id > 0){

        this.notificationSvc.success("Оружие успешно добавлено!");

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
