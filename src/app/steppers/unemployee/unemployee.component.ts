import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment'
import { NotificationService } from 'src/app/notification.service';
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
  selector: 'app-unemployee',
  templateUrl: './unemployee.component.html'
})
export class UnemployeeComponent implements OnInit {
  passportSeries: selectItem[] = [
    {value: 'ID', viewValue: 'ID'},
    {value: 'AN', viewValue: 'AN'},
  ];
  banks: any[] = [];
  requestFormGroup: FormGroup;
  contactsFormGroup: FormGroup;
  socialCategoryFormGroup: FormGroup;
  labourActivityFormGroup: FormGroup;
  isPassportDataLoading = true;
  isISRTDataLoading = true;
  constructor(private _formBuilder: FormBuilder, private dataSvc: DataService, private notificationSvc: NotificationService) {}
  get IsUnemployee():any{
    return this.socialCategoryFormGroup.get('IsUnemployee')
  }
  get IsReturnedMigrant():any{
    return this.socialCategoryFormGroup.get('IsReturnedMigrant')
  }
  ngOnInit() {
    this.loadDatas();
    this.requestFormGroup = this._formBuilder.group({
      PIN: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      PassportSeries: ['', Validators.required],
      PassportNo: ['', Validators.required],
    });
    this.contactsFormGroup = this._formBuilder.group({
      Telephone: '',
      DistrictResourceId:'',
      Address: '',
      BankResourceId: '',
      BankAccountNo: '',
      BankBIK:''
    });
    this.socialCategoryFormGroup = this._formBuilder.group({
      IsUnemployee: false,
      UnemployeeReasonResourceId: '',
      IsDisability: false,
      IsReturnedMigrant: false,
      MigratedFromResourceId: '',
      EducationResourceId: '',
    });
    this.labourActivityFormGroup = this._formBuilder.group({
      LabourActivityResourceId: '',
      OrganizationName: '',
      JobPositionName: '',
      AvgIncome: '',
      FamilyMemberCount: '',
    });
  }
  passportData: any = null;
  isrtData: any = null;
  loadDatas(){
    //this.loadPassportData();
    //this.loadISRTData();
    this.loadBankNames();
    this.loadUnemployeeReasonResources();
    this.loadMigratedFromResources();
    this.loadEducationResources();
    this.loadLabourActivityResources();
    this.loadRegions();
  }
  loadBankNames(){
    this.dataSvc.getODataResource('BankResources').subscribe((_) => {
      this.banks = _.value;
    });
  }
  migratedFromResources: any[] = [];
  loadMigratedFromResources(){
    this.dataSvc.getODataResource('MigratedFromResources').subscribe((_) => {
      this.migratedFromResources = _.value;
    });
  }
  regions: any[] = [];
  loadRegions(){
    this.dataSvc.getODatatResourceExpanded('RegionResources').subscribe((_) => {
      this.regions = _.value;
    });
  }
  educationResources: any[] = [];
  loadEducationResources(){
    this.dataSvc.getODataResource('EducationResources').subscribe((_) => {
      this.educationResources = _.value;
    });
  }
  labourActivityResources: any[] = [];
  loadLabourActivityResources(){
    this.dataSvc.getODataResource('LabourActivityResources').subscribe((_) => {
      this.labourActivityResources = _.value;
    });
  }
  loadPassportData(){
    if(this.requestFormGroup.valid){
      this.isPassportDataLoading = true;
    this.dataSvc.getPassportData(this.requestFormGroup.value.pin, this.requestFormGroup.value.passportSeries, this.requestFormGroup.value.passportNo).subscribe((_) => {
      this.passportData = _;
      this.isPassportDataLoading = false;
    });
    }
  }
  unemployeeReasonResources: any[] = [];
  loadUnemployeeReasonResources(){
    this.dataSvc.getODataResource('UnemployeeReasonResources').subscribe((_) => {
      this.unemployeeReasonResources = _.value;
    });
  }
  loadISRTData(){
    if(this.requestFormGroup.valid){
      this.isISRTDataLoading = true;
    this.dataSvc.getISRTData(this.requestFormGroup.value.pin).subscribe((_) => {
      this.isrtData = _;
      this.isISRTDataLoading = false;
    });
    }
  }
  isDataSubmitting: boolean = false;
  isDataSubmitted: boolean = false;
  submit(){
    this.isDataSubmitting = true;
    var obj = {
      ...this.requestFormGroup.value,
      ...this.socialCategoryFormGroup.value,
      ...this.contactsFormGroup.value,
      ...this.labourActivityFormGroup.value,
      CreatedAt: moment(Date.now()).format('YYYY-MM-DD'),
      AvgIncome: parseInt(this.labourActivityFormGroup.value.AvgIncome),
      FamilyMemberCount: parseInt(this.labourActivityFormGroup.value.FamilyMemberCount)
    }
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
    this.dataSvc.postODataResource("ApplicantResources", obj).subscribe((_) => {
      this.isDataSubmitting = false;
      this.isDataSubmitted = true;
      this.notificationSvc.success("Ваша заявка успешно оформлена!")
    });

    console.log('submit', obj)
  }
}
