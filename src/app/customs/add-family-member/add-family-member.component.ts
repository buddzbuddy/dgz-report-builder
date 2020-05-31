import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { OAuthService } from 'angular-oauth2-oidc';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-add-family-member',
  templateUrl: './add-family-member.component.html',
  styleUrls: ['./add-family-member.component.scss']
})
export class AddFamilyMemberComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
    private notificationSvc: NotificationService, private router: Router, private dataSvc: DataService, private oauthService: OAuthService) { }
  personId: number = 0;
  formGroup: FormGroup;
  ngOnInit() {
    this.loadDatas();
    this.formGroup = this._formBuilder.group({
      PIN: '',//['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      //PassportSeries: '',//['', Validators.required],
      //PassportNo: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      FullName: '',//['', Validators.required],
      RelationTypeResourceId: ''
    });
    this.route.params.subscribe(params => {
      if (params['personId'] != null) {
        this.personId = params['personId'];
      }
    });
  }
  relationTypes: any[] = [];
  loadDatas(){
    this.loadRelationTypes();
  }

  loadRelationTypes(){
    this.dataSvc.getODataResource('RelationTypeResources').subscribe((_) => {
      this.relationTypes = _.value;
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
      this.dataSvc.postODataResource("FamilyMemberResources", obj).subscribe((_) => {
        if(_.Id > 0){

        this.notificationSvc.success("Член семьи успешно добавлен!");

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
