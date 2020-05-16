import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment'
import { NotificationService } from 'src/app/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
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
  @ViewChild('invisibleText', { static: false }) invisibleText: ElementRef;
  passportSeries: selectItem[] = [
    {value: 'ID', viewValue: 'ID'},
    {value: 'AN', viewValue: 'AN'},
  ];
  banks: any[] = [];
  requestFormGroup: FormGroup;
  contactsFormGroup: FormGroup;
  socialCategoryFormGroup: FormGroup;
  labourActivityFormGroup: FormGroup;
  summaryFormGroup: FormGroup;
  isPassportDataLoading = false;
  isISRTDataLoading = true;
  constructor(private _formBuilder: FormBuilder, private dataSvc: DataService, private notificationSvc: NotificationService, public dialog: MatDialog, private router: Router) {}
  get IsUnemployee(): boolean {
    let IsUnemployee = this.socialCategoryFormGroup.get('IsUnemployee').value;

    if(IsUnemployee){
      const control = this._formBuilder.control('');
      this.socialCategoryFormGroup.addControl('UnemployeeReasonResourceId', control);
    }
    else {
      this.socialCategoryFormGroup.removeControl('UnemployeeReasonResourceId');
    }

    return IsUnemployee;
  }
  get IsUnemployeeReasonOther(): boolean {
    let control = this.socialCategoryFormGroup.get('UnemployeeReasonResourceId');
    if(control == null) return false;
    let val = control.value;
    let isOther = val === 3;

    if(isOther){
      const control = this._formBuilder.control('');
      this.socialCategoryFormGroup.addControl('UnemployeeReasonOther', control);
    }
    else {
      this.socialCategoryFormGroup.removeControl('UnemployeeReasonOther');
    }

    return isOther;
  }
  get IsLabourActivityOther(): boolean {
    let control = this.labourActivityFormGroup.get('LabourActivityResourceId');
    let val = control.value;
    let isOther = val === 4;

    if(isOther){
      const control = this._formBuilder.control('');
      this.labourActivityFormGroup.addControl('LabourActivityOther', control);
    }
    else {
      this.labourActivityFormGroup.removeControl('LabourActivityOther');
    }

    return isOther;
  }
  get IsReturnedMigrant(): boolean {

    let IsReturnedMigrant = this.socialCategoryFormGroup.get('IsReturnedMigrant').value;

    if(IsReturnedMigrant){
      const control = this._formBuilder.control('');
      this.socialCategoryFormGroup.addControl('MigratedFromResourceId', control);
    }
    else {
      this.socialCategoryFormGroup.removeControl('MigratedFromResourceId');
    }

    return IsReturnedMigrant;

  }
  get IsMigratedFromOther(): boolean {
    let control = this.socialCategoryFormGroup.get('MigratedFromResourceId');
    if(control == null) return false;
    let val = control.value;
    let isOther = val === 6;

    if(isOther){
      const control = this._formBuilder.control('');
      this.socialCategoryFormGroup.addControl('MigratedFromOther', control);
    }
    else {
      this.socialCategoryFormGroup.removeControl('MigratedFromOther');
    }

    return isOther;
  }
  IsAgreed: boolean = false;
  isPINLoading: boolean = false;
  onSearchCISSA(pin: string): void {
    if(pin.length == 14) {
      this.isPINLoading = true;
      this.dataSvc.customApi_GetPassportByPIN(pin).subscribe(_ => {
        this.isPINLoading = false;
        this.requestFormGroup.patchValue({
          PassportSeries: _.PassportSeries,
          PassportNo: _.PassportNo,
          FullName: _.FullName
        });

        if(_.PassportNo == null || !_.PassportNo.length) {
          this.dataSvc.filterODataResource('ApplicantResources', `$filter=PIN eq '${pin}'&$orderby=Id desc`).subscribe(res => {
            if(res.value.length) {
              let singleObj = res.value[0];
              this.requestFormGroup.patchValue({
                PassportSeries: singleObj.PassportSeries,
                PassportNo: singleObj.PassportNo,
                FullName: singleObj.FullName
              });
              this.fullName = singleObj.FullName;
              this.resizeInput();
              this.checkExistingApps();
              this.loadPassportDataAsync();
            }
            else {
              this.onSearchSRS();
            }
          });
        }
        else {
          this.onSearchSRS();
        }
      });
    }
  }
  onSearchSRS(targetVal: any = null) : void {
    let PassportNo = this.requestFormGroup.value.PassportNo;
    let PassportSeries = this.requestFormGroup.value.PassportSeries;
    this.requestFormGroup.patchValue({
      FullName: ''
    });
    if(PassportNo.length == 7) {
        this.loadPassportData();
    }
  }
  width: number = 180
  resizeInput() {
    //this.textVis = this.inString; //this.inputTextER.nativeElement.value;
    //this.textInv = this.inString;
    //this.invTextER.nativeElement.value = this.inputTextER.nativeElement.value;
    //this.formFieldInputER.nativeElement.style.width = this.invTextER.nativeElement.offsetWidth + 2 + 'px';
    // without setTimeout the width gets updated to the previous length
    setTimeout ( () =>{

      let minWidth = 180;
      if (this.invisibleText.nativeElement.offsetWidth > minWidth) {
        this.width = this.invisibleText.nativeElement.offsetWidth + 2;
      } else {
        this.width = minWidth;
      }

    }, 0);
  }
  ngOnInit() {

    this.loadDatas();
    this.requestFormGroup = this._formBuilder.group({
      PIN: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      PassportSeries: ['', Validators.required],
      PassportNo: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
      FullName: ['', Validators.required],
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
      IsDisability: false,
      IsReturnedMigrant: false,
      EducationResourceId: '',
    });
    this.labourActivityFormGroup = this._formBuilder.group({
      LabourActivityResourceId: '',
      OrganizationINN: '',
      OrganizationName: '',
      JobPositionName: '',
      AvgIncome: '',
      FamilyCountResourceId: '',
    });
    this.summaryFormGroup = this._formBuilder.group({
      PIN: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      PassportSeries: ['', Validators.required],
      PassportNo: ['', Validators.required],
      Telephone: '',
      DistrictResourceId:'',
      Address: '',
      BankResourceId: '',
      BankAccountNo: '',
      BankBIK:'',
      IsUnemployee: false,
      IsDisability: false,
      IsReturnedMigrant: false,
      EducationResourceId: '',
      LabourActivityResourceId: '',
      OrganizationINN: '',
      OrganizationName: '',
      JobPositionName: '',
      AvgIncome: '',
      FamilyCountResourceId: '',
      UnemployeeReasonResourceId:'',
      UnemployeeReasonOther:'',
      LabourActivityOther:'',
      MigratedFromResourceId:'',
      MigratedFromOther:''
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
    this.loadFamilyCountResources();
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
  familyCountResources: any[] = [];
  loadFamilyCountResources(){
    this.dataSvc.getODataResource('FamilyCountResources').subscribe((_) => {
      this.familyCountResources = _.value;
    });
  }
  showFinalForm() {
    this.summaryFormGroup.patchValue({
      ...this.requestFormGroup.value,
      ...this.socialCategoryFormGroup.value,
      ...this.labourActivityFormGroup.value
    });
    this.summaryFormGroup.disable();
  }
  fullName: string
  loadPassportData(){
    this.isPassportDataLoading = true;
    this.dataSvc.customApi_getPassportData(this.requestFormGroup.value.PIN, this.requestFormGroup.value.PassportSeries, this.requestFormGroup.value.PassportNo).subscribe((_) => {
      this.isPassportDataLoading = false;
      if(_.faultcode == null) {
        this.passportData = _;
        this.fullName = _.surname + ' ' + _.name + ' ' + _.patronymic;
        this.requestFormGroup.patchValue({
          FullName: this.fullName
        });
        this.resizeInput();
      }
      this.checkExistingApps();
    });
  }
  loadPassportDataAsync(){
    this.dataSvc.customApi_getPassportData(this.requestFormGroup.value.PIN, this.requestFormGroup.value.PassportSeries, this.requestFormGroup.value.PassportNo).subscribe((_) => {
      if(_.faultcode == null) {
        this.passportData = _;
      }
    });
  }
  existingApps: any[] = [];
  checkExistingApps() {
    let pin = this.requestFormGroup.value.PIN;
    this.dataSvc.filterODataResourceExpanded('ApplicantResources', `$filter=PIN eq '${pin}'&$orderby=Id desc`).subscribe(_ => {
      this.existingApps = _.value;
    });
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
    this.dataSvc.customApi_getISRTData(this.requestFormGroup.value.pin).subscribe((_) => {
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
      CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
      AvgIncome: parseInt(this.labourActivityFormGroup.value.AvgIncome)
    }
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == '') && delete obj[key]);
    this.dataSvc.postODataResource("ApplicantResources", obj).subscribe((_) => {
      this.isDataSubmitting = false;
      this.isDataSubmitted = true;

      this.notificationSvc.success("Ваша заявка успешно оформлена!")

      this.router.navigate(['/home']);
    });

    console.log('submit', obj)
  }

  viewAgreement() {
    let districtName = '';
    for (let index = 0; index < this.regions.length; index++) {
      const region = this.regions[index];
      if(region.DistricResources) {
        for (let i2 = 0; i2 < region.DistricResources.length; i2++) {
          const district = region.DistricResources[i2];
          if(district.Id == this.contactsFormGroup.value.DistrictResourceId) {
            districtName = district.Name;
          }
        }
      }
    }

    const dialogRef = this.dialog.open(ViewAgreementDialog, {
      width: '800px',
      data: {
        fullName: this.requestFormGroup.value.FullName,
        address: districtName + ' ' + this.contactsFormGroup.value.Address,
        passport: 'паспорт серия ' + this.passportData.passportSeries + ' номер ' + this.passportData.passportNumber + ' выданного от ' + moment(this.passportData.issuedDate).format('DD.MM.YYYY') + ' орган ' + this.passportData.passportAuthority
      }
    });
  }
}
export interface ViewAgreementDialogData {
  fullName: string;
  address: string;
  passport: string;
}
@Component({
  selector: 'view-agreement-dialog',
  templateUrl: 'view-agreement-dialog.html',
})
export class ViewAgreementDialog{
  constructor(
    public dialogRef: MatDialogRef<ViewAgreementDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ViewAgreementDialogData) {}
    currentDate() {
      return moment(Date.now()).format('DD.MM.YYYY')
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
