import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment'
import { NotificationService } from 'src/app/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
interface selectItem {
  value: string;
  viewValue: string;
}
interface selectItemGroup {
  disabled?: boolean;
  name: string;
  selectItems: selectItem[];
}
@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.scss']
})
export class CreatePersonComponent implements OnInit {
  @ViewChild('invisibleText', { static: false }) invisibleText: ElementRef;
  passportSeries: selectItem[] = [
    {value: 'ID', viewValue: 'ID'},
    {value: 'AN', viewValue: 'AN'},
  ];
  requestFormGroup: FormGroup;
  contactsFormGroup: FormGroup;
  animalFormGroup: FormGroup;
  carFormGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder, private dataSvc: DataService, private notificationSvc: NotificationService,
    public oauthService: OAuthService, private router: Router) {}

  ngOnInit() {

    this.requestFormGroup = this._formBuilder.group({
      PIN: '',//['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      //PassportSeries: '',//['', Validators.required],
      //PassportNo: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      FullName: ''//['', Validators.required],
    });
    this.contactsFormGroup = this._formBuilder.group({
      Telephone: '',
      DistrictResourceId:'',
      Street: '',
      House: '',
      Apartment: '',
      BirthCountryResourceId:'',
      BirthAddress: '',
      JobOrganizationName: '',
      JobAddress: '',
      JobTelephone: '',

    });
    this.animalFormGroup = this._formBuilder.group({
      AnimalName: '',
      AnimalBreed: '',
      AnimalColor:'',
      AnimalNick: '',
      AnimalSpecialSigns: '',
      Comments: '',

    });
    this.carFormGroup = this._formBuilder.group({
      CarVID: '',
      CarName: '',
      CarModel:'',
      CarColor: '',
      CarReleaseYear: '',
      CarProdCountry: '',
      CarBodyType: '',
      CarBodyType2: '',
      CarCapacity: '',
      CarComment: '',
      CarOwnerFullName: '',

    });
    this.loadDatas();
  }

  districts: any[] = [];
  loadDistricts() {
    this.dataSvc.getODataResource('DistrictResources').subscribe(_ => {
      this.districts = _.value;
    });
  }
  countries: any[] = [];
  loadCountries() {
    this.dataSvc.getODataResource('CountryResources').subscribe(_ => {
      this.countries = _.value;
    });
  }
  loadDatas() {
    this.loadDistricts();
    this.loadCountries();
  }

  passportData: any = null;
  isrtData: any = null;
  isDataSubmitting: boolean = false;
  isDataSubmitted: boolean = false;
  submit(){
    this.isDataSubmitting = true;
    var obj = {
      ...this.requestFormGroup.value,
      ...this.contactsFormGroup.value,
      ...this.animalFormGroup.value,
      ...this.carFormGroup.value,
      UserId: this.oauthService.getIdentityClaims()['sub'],
      CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
    }
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
    this.dataSvc.postODataResource("PersonResources", obj).subscribe((_) => {
      if(_.Id > 0){
        this.isDataSubmitting = false;
      this.isDataSubmitted = true;

      this.notificationSvc.success("Ваша заявка успешно оформлена!")

      this.router.navigate(['/home']);
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так ((')
      }
    });

    console.log('submit', obj)
  }

}
