import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { DataService } from 'src/app/data.service';

import { FieldConfig } from 'src/app/field.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-create-identity-card',
  templateUrl: './create-identity-card.component.html',
  styleUrls: ['./create-identity-card.component.scss']
})
export class CreateIdentityCardComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
    private notificationSvc: NotificationService, private router: Router, private dataSvc: DataService, ) { }
  formGroup: FormGroup;
  personId: number = 0;
  ExpiryDateField: FieldConfig = { type: 'date', name: 'ExpiryDate', label: 'Действителен до' };
  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      ExpiryDate: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      IssuedBy: '',//['', Validators.required],
      DocumentNo: ''
    });
    this.route.params.subscribe(params => {
      if (params['personId'] != null) {
        this.personId = params['personId'];
      }
    });
  }

  submit(){
    if(true) {
      var obj = {
        ...this.formGroup.value,
        PersonResourceId: this.personId,
        CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),

      }
      //Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
      this.dataSvc.postODataResource("IdentityCardResources", obj).subscribe((_) => {
        if(_.Id > 0){

        this.notificationSvc.success("Документ успешно добавлен!");

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
