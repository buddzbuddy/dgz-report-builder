import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment'
import { NotificationService } from 'src/app/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { FieldConfig } from 'src/app/field.interface';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
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
  styleUrls: ['./create-person.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CreatePersonComponent implements OnInit {
  @ViewChild('invisibleText') invisibleText: ElementRef;
  passportSeries: selectItem[] = [
    {value: 'ID', viewValue: 'ID'},
    {value: 'AN', viewValue: 'AN'},
  ];
  requestFormGroup: FormGroup;
  contactsFormGroup: FormGroup;
  animalFormGroup: FormGroup;
  carFormGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder, private dataSvc: DataService, private notificationSvc: NotificationService,public dialog: MatDialog,
    public oauthService: OAuthService, private router: Router) {}
    get IsTemporarilyLive(): boolean {
      let IsTemporarilyLive = this.contactsFormGroup.get('IsTemporarilyLive').value;

      if(IsTemporarilyLive){
        const control = this._formBuilder.control(null);
        this.contactsFormGroup.addControl('TemporarilyLiveFrom', control);
        this.contactsFormGroup.addControl('TemporarilyLiveTo', control);
      }
      else {
        this.contactsFormGroup.removeControl('TemporarilyLiveFrom');
        this.contactsFormGroup.removeControl('TemporarilyLiveTo');
      }

      return IsTemporarilyLive;
    }
    temporarilyLiveFromField: FieldConfig = { type: 'date', name: 'TemporarilyLiveFrom', label: 'Срок проживания С' };
    temporarilyLiveToField: FieldConfig = { type: 'date', name: 'TemporarilyLiveTo', label: 'Срок проживания По' };
  ngOnInit() {

    this.requestFormGroup = this._formBuilder.group({
      PIN: '',//['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      //PassportSeries: '',//['', Validators.required],
      //PassportNo: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      FullName: ''//['', Validators.required],
    });

    this.contactsFormGroup = this._formBuilder.group({
      Telephone1: '',
      Telephone2: '',
      DistrictResourceId:'',
      Street: '',
      House: '',
      Apartment: '',
      IsTemporarilyLive: '',
      BirthCountryResourceId:'',
      BirthTown: '',
      BirthStreet: '',
      BirthHouse: '',
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
      CarComment2: '',
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
    if(confirm('Вы уверены что хотите сохранить и продолжить ввод?')){
      this.isDataSubmitting = true;
      var obj = {
        ...this.requestFormGroup.value,
        ...this.contactsFormGroup.value,
        ...this.animalFormGroup.value,
        ...this.carFormGroup.value,
        UserId: this.oauthService.getIdentityClaims()['sub'],
        CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
        Id: this.personObj.Id
      }
      Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
      this.dataSvc.putODataResource("PersonResources", obj).subscribe((_) => {
        this.notificationSvc.success("Запись успешно сохранена в папке \"Проживающий на цчастке\"!")

        this.router.navigate(['/home']);
      });

      console.log('save complete', obj)
    }
  }
  personObj: any = null;
  saveAndNext() {
    if(!this.contactsFormGroup.invalid) {
      if(confirm('Вы уверены что хотите сохранить и продолжить ввод?')){
        if(this.personObj == null) {
          this.create();
        }
        else {
          this.update();
        }
      }
    }
  }
  create() {
    this.isDataSubmitting = true;
    var obj = {
      ...this.requestFormGroup.value,
      ...this.contactsFormGroup.value,
      UserId: this.oauthService.getIdentityClaims()['sub'],
      CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
    }
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
    this.dataSvc.postODataResource("PersonResources", obj).subscribe((_) => {
      if(_.Id > 0){
        this.isDataSubmitting = false;
        this.isDataSubmitted = true;
        this.personObj = _;
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так ((')
      }
    });
  }
  update() {
    var obj = {
      ...this.requestFormGroup.value,
      ...this.contactsFormGroup.value,
      ...this.animalFormGroup.value,
      ...this.carFormGroup.value,
      Id: this.personObj.Id
    }
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
    this.dataSvc.putODataResource("PersonResources", obj).subscribe((_) => {
      this.personObj = obj;
    });
  }
  searchMDataPin(){
    if(this.requestFormGroup.value.PIN !== '') {
      const dialogRef = this.dialog.open(MDataSearchDialog, {
        data: {
          pin: this.requestFormGroup.value.PIN,
        }
      });
    }
    else {
      this.notificationSvc.warn('ПИН не заполнен!')
    }
  }
  searchMDataFullName(){
    if(this.requestFormGroup.value.FullName !== '') {
      const dialogRef = this.dialog.open(MDataSearchDialog, {
        //width: '500px',
        data: {
          fullname: this.requestFormGroup.value.FullName,
        }
      });
    }
    else {
      this.notificationSvc.warn('ФИО не заполнен!')
    }
  }
}

export interface MDataSearchDialogData {
  pin: string;
  fullname: string;
}
@Component({
  selector: 'm-data-search-dialog',
  templateUrl: 'm-data-search-dialog.html',
})
export class MDataSearchDialog{
  constructor(
    public dialogRef: MatDialogRef<MDataSearchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: MDataSearchDialogData) {}
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
