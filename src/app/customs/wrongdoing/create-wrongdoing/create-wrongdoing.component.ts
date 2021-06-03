import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldConfig } from 'src/app/field.interface';
import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-create-wrongdoing',
  templateUrl: './create-wrongdoing.component.html',
  styleUrls: ['./create-wrongdoing.component.scss']
})
export class CreateWrongdoingComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
    private notificationSvc: NotificationService, private router: Router, private dataSvc: DataService, ) { }
  formGroup: FormGroup;
  personId: number = 0;
  MadeAtField: FieldConfig = { type: 'date', name: 'MadeAt', label: 'Дата правонарушения' };
  RegDateField: FieldConfig = { type: 'date', name: 'RegDate', label: 'Дата постановки на учет' };
  ExpiryDateField: FieldConfig = { type: 'date', name: 'ExpiryDate', label: 'Дата снятия с учета' };
  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      MadeAt: '',//['', Validators.required],
      ExpiryDate: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      RegDate: '',//['', Validators.required],
      OffenseArticle: ''
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
      this.dataSvc.postODataResource("WrongdoingResources", obj).subscribe((_) => {
        if(_.Id > 0){

        this.notificationSvc.success("Правонарушение успешно добавлено!");

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
