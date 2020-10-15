
import * as moment from 'moment'
import { OAuthService } from 'angular-oauth2-oidc';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import { DataService } from '../../data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-koyka',
  templateUrl: './koyka.component.html',
  styleUrls: ['./koyka.component.scss']
})
export class KoykaComponent implements AfterViewInit {
  url = AppConfig.settings.dashboardUrl;//'http://localhost/mvd_dashboard/#/dashboard';
  
  constructor(
    public oauthService: OAuthService,
    private dataSvc: DataService,
    public dialog: MatDialog) {
      
    this.now$ = interval(1000).pipe(
      startWith(null),
      map(() => new Date())
    );
    }
  ngAfterViewInit() {
    this.getCounterInfo();
    this.today = moment(Date.now()).format('DD.MM.YYYY');
  }
  today: any;
  now$: Observable<Date>;
  new() {
    if(this.oauthService.hasValidAccessToken()) {
      const dialogRef = this.dialog.open(NewPatientDialog, {
        data: {
          UserId: this.userProfile['sub'],
          OrgId: this.userProfile['orgId']
        }
      });
      dialogRef.afterClosed().subscribe(_ => {
        this.getCounterInfo();
      });
    }
  }
  out(){
    if(this.oauthService.hasValidAccessToken()) {
      const dialogRef = this.dialog.open(OutPatientDialog, {
        data: {
          UserId: this.userProfile['sub'],
          OrgId: this.userProfile['orgId']
        }
      });
      dialogRef.afterClosed().subscribe(_ => {
        this.getCounterInfo();
      });
    }
  }
  dead(){
    if(this.oauthService.hasValidAccessToken()) {
      const dialogRef = this.dialog.open(DeadPatientDialog, {
        data: {
          UserId: this.userProfile['sub'],
          OrgId: this.userProfile['orgId']
        }
      });
      dialogRef.afterClosed().subscribe(_ => {
        this.getCounterInfo();
      });
    }
  }
  get claims(): any {
    this.userProfile = this.oauthService.getIdentityClaims();
    return this.userProfile;
  }
  userProfile: any = {}
  counterInfo: any = {}
  regionItems: any[] = []
  getCounterInfo() {
    
    setTimeout(() => {
      if(this.oauthService.hasValidAccessToken()) {
        let userId = this.claims['sub'];
        console.log('AOUTHORIZED')
        this.dataSvc.customApi_Patients_GetCounterInfo(userId).subscribe(_ => {
          this.counterInfo = _;
        });
      }
      else {
        this.dataSvc.customApi_Patients_GetRegionItems().subscribe(_ => {
          this.regionItems = _;
          
        });
      }
    }, 1000);
  }

}

export interface NewPatientDialogData {
  UserId: string;
  OrgId: number;
}
@Component({
  selector: 'new-patient-dialog',
  templateUrl: 'new-patient-dialog.html',
})
export class NewPatientDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NewPatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewPatientDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        DiagnosType: ['', [Validators.required]],
        //PassportSeries: '',//['', Validators.required],
        //PassportNo: '',//['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
        Telephone: ['', [Validators.required, Validators.maxLength(14)]],
      });
    }
  onSaveClick(): void {
    
    let obj = {
      CreatedAt: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
      UserId: this.data.UserId,
      OrgId: this.data.OrgId,
      ...this.formGroup.value,

    };
    this.dataSvc.filterODataResource('PatientBedResources', `$filter=Telephone eq '${this.formGroup.value.Telephone}'`).subscribe(res => {
      if(!res.value.length) {
        this.dataSvc.postODataResource('PatientBedResources', obj).subscribe(_ => {
          this.dialogRef.close();
        });
      }
      else {
        alert('Пациент с таким ПИН или номером существует! Проверьте правильность данных!');
      }
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

export interface OutPatientDialogData {
  UserId: string;
  OrgId: number;
}
@Component({
  selector: 'out-patient-dialog',
  templateUrl: 'out-patient-dialog.html',
})
export class OutPatientDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<OutPatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OutPatientDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        Telephone: ['', [Validators.required, Validators.maxLength(14)]],
      });
    }
  onSaveClick(): void {
    
    this.dataSvc.filterODataResource('PatientBedResources', `$filter=Telephone eq '${this.formGroup.value.Telephone}' and OrgId eq ${this.data.OrgId}`).subscribe(res => {
      if(!res.value.length) {
        alert('Пациент с таким ПИН или номером не существует! Проверьте правильность данных!');
      }
      else {
        if(res.value[0].IsDead) {
          alert('Пациент уже умер!');
          return;
        }
        if(res.value[0].IsExpired) {
          alert('Пациент уже выписан!');
          return;
        }
        this.dataSvc.customApi_Patients_Out(res.value[0].Id).subscribe(_ => {
          this.dialogRef.close();
        });
      }
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

export interface DeadPatientDialogData {
  UserId: string;
  OrgId: number;
}
@Component({
  selector: 'dead-patient-dialog',
  templateUrl: 'dead-patient-dialog.html',
})
export class DeadPatientDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DeadPatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeadPatientDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        Telephone: ['', [Validators.required, Validators.maxLength(14)]],
      });
    }
  onSaveClick(): void {
    
    this.dataSvc.filterODataResource('PatientBedResources', `$filter=Telephone eq '${this.formGroup.value.Telephone}' and OrgId eq ${this.data.OrgId}`).subscribe(res => {
      if(!res.value.length) {
        alert('Пациент с таким ПИН или номером не существует! Проверьте правильность данных!');
      }
      else {
        if(res.value[0].IsDead) {
          alert('Пациент уже умер!');
          return;
        }
        if(res.value[0].IsExpired) {
          alert('Пациент уже выписан!');
          return;
        }
        this.dataSvc.customApi_Patients_Dead(res.value[0].Id).subscribe(_ => {
          this.dialogRef.close();
        });
      }
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
