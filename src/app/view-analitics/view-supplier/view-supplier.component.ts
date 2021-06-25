import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';
import * as moment from 'moment';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private route: ActivatedRoute,
    private dialog: MatDialog, private notificationSvc: NotificationService,) { }
  @Input() supplier: any = { licenses: [], ip_items: [] }
  @Input() supplierId: number = 0;
  hasRoute = false
  ngOnInit() {
    if (this.supplierId > 0) {
      this.get_supplier_details();
    }
    else if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['supplierId'] != null) {
          this.isCabinet = false;
          this.supplierId = params['supplierId'];
          this.get_supplier_details();
          this.hasRoute = true;
        }
      });
    }
    this.getGlobalGrantedSources();
  }
  get_supplier_details() {
    const href = 'data-api/supplier-requests/getDetails/' + this.supplierId;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.supplier = _;
      console.log(_);
      //this.getContractData();
    });
  }
  contractInfo: any = {}
  isLoadingResults: boolean = true;
  hasContractData: boolean = true;
  getContractData() {
    const href = '/api/tendering?&size=1000';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host_tendering + requestUrl).subscribe(_ => {
      //console.log(_);

      let c = null;
      for (let i = 0; i < _.releases.length; i++) {
        let r = _.releases[i];
        for (let j = 0; j < r.parties.length; j++) {
          let p = r.parties[j];
          if (p.identifier.id == this.supplier.inn && p.roles.indexOf('supplier') > -1) {
            c = r.contracts[0];
            this.contractInfo = c;
            console.log(c);
            break;
          }
        }
        if (c !== null) break;
      }
      this.isLoadingResults = false;
      this.hasContractData = c !== null;
    });
  }
  goBack() {
    window.history.back();
  }

  licenseChecked = false
  debtChecked = false
  getGlobalGrantedSources() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, { rootName: 'GrantedSource' }).subscribe(_ => {
      if (_['data'] != null) {
        let grantedSources: any[] = _['data'];
        for (let index = 0; index < grantedSources.length; index++) {
          const gSource = grantedSources[index];
          if (gSource.sourceType == 'LICENSE') {
            this.licenseChecked = true;
          }
          if (gSource.sourceType == 'DEBT') {
            this.debtChecked = true;
          }
        }
      }
      this.getLocalGrantedSources();
    })
  }
  getLocalGrantedSources() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: 'LocalGrantedSource',
      searchFitler: [
        {
          property: 'supplierId',
          operator: '=',
          value: this.supplierId
        }
      ]
    };
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if (_['data'] != null) {
        let grantedSources: any[] = _['data'];
        for (let index = 0; index < grantedSources.length; index++) {
          const gSource = grantedSources[index];
          if (gSource.sourceType == 'LICENSE') {
            this.licenseChecked = false;
          }
          if (gSource.sourceType == 'DEBT') {
            this.debtChecked = false;
          }
        }
      }
    })
  }

  isCabinet = true;
  addSupplierMember() {
    const dialogRef = this.dialog.open(AddSupplierMemberDialog, {
      data: {
        supplierId: this.supplierId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.get_supplier_details();
      }
    });
  }
  addLicense() {
    const dialogRef = this.dialog.open(AddLicenseDialog, {
      data: {
        supplierId: this.supplierId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.get_supplier_details();
      }
    });
  }
  addDeal() {
    const dialogRef = this.dialog.open(AddDealDialog, {
      data: {
        supplierId: this.supplierId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.get_supplier_details();
      }
    });
  }
  addCertificate() {
    const dialogRef = this.dialog.open(AddCertificateDialog, {
      data: {
        supplierId: this.supplierId,
        supplierMembers: this.supplier.supplierMembers
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.get_supplier_details();
      }
    });
  }
  remove(name, id) {
    if (confirm('Вы уверены что хотите удалить запись?')) {
      const href = `data-api/query/delete/${name}/${id}`;
      const requestUrl = `${href}`;
      this._httpClient.get<boolean>(AppConfig.settings.host + requestUrl).subscribe(_ => {
        if (_) {
          this.notificationSvc.success('Запись успешно удалена!');
          this.get_supplier_details();
        }
        else {
          this.notificationSvc.warn('Что-то пошло не так!');
        }
      });
    }
  }
}


@Component({
  selector: 'add-supplier-member-dialog',
  templateUrl: 'add-supplier-member-dialog.html',
})
export class AddSupplierMemberDialog implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddSupplierMemberDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient,
    private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      memberTypeId: ['', Validators.required],
      pin: ['', [Validators.required]],
      surname: ['', Validators.required],
      name: ['', [Validators.required]],
      patronymic: ''//['', Validators.required],
    });
    this.loadMemberTypes();
  }
  conditions: any = {

  }
  onSaveClick(): void {
    this.save();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  memberTypes: any[] = [];
  loadMemberTypes() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: "MemberType"
    }
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.memberTypes = _['data'];
    });
  }
  save() {
    const href = `data-api/query/insert`;
    const requestUrl = `${href}`;
    let fObj = []
    for (let fName of Object.keys(this.formGroup.value)) {
      fObj.push({
        name: fName,
        val: this.formGroup.value[fName]
      });
    }
    fObj.push({
      name: 'supplierId',
      val: this.data.supplierId
    });
    let obj = {
      entityName: 'SupplierMember',
      fields: fObj
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if (_) {
        this.notificationSvc.success('Успешно добавлен!');
        this.dialogRef.close(_);
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так!');
      }
    });
  }
}

@Component({
  selector: 'add-license-dialog',
  templateUrl: 'add-license-dialog.html',
})
export class AddLicenseDialog implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddLicenseDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient,
    private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      issuer: ['', Validators.required],
      no: ['', [Validators.required]],
      issueDate: ['', Validators.required],
      licenseTypeId: ['', [Validators.required]],
      expiryDate: ['', Validators.required],
    });
    this.loadLicenseTypes();
  }
  conditions: any = {

  }
  onSaveClick(): void {
    this.save();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  licenseTypes: any[] = [];
  loadLicenseTypes() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: "LicenseType"
    }
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.licenseTypes = _['data'];
    });
  }
  save() {
    const href = `data-api/query/insert`;
    const requestUrl = `${href}`;
    let fObj = []
    for (let fName of Object.keys(this.formGroup.value)) {
      if (fName == 'issueDate' || fName == 'expiryDate') {

        let o = moment(this.formGroup.value[fName]).format('YYYY-MM-DD')

        fObj.push({
          name: fName,
          val: o
        });
      }
      else {
        fObj.push({
          name: fName,
          val: this.formGroup.value[fName]
        });
      }
    }
    fObj.push({
      name: 'supplierId',
      val: this.data.supplierId
    });
    let obj = {
      entityName: 'License',
      fields: fObj
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if (_) {
        this.notificationSvc.success('Запись успешно добавлена!');
        this.dialogRef.close(_);
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так!');
      }
    });
  }
}

@Component({
  selector: 'add-deal-dialog',
  templateUrl: 'add-deal-dialog.html',
})
export class AddDealDialog implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddDealDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient,
    private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      customer: ['', Validators.required],
      dealSubject: ['', [Validators.required]],
      dealPeriod: ['', Validators.required],
      dealPrice: ['', [Validators.required]],
    });
  }
  onSaveClick(): void {
    this.save();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  save() {
    const href = `data-api/query/insert`;
    const requestUrl = `${href}`;
    let fObj = []
    for (let fName of Object.keys(this.formGroup.value)) {
      fObj.push({
        name: fName,
        val: this.formGroup.value[fName]
      });
    }
    fObj.push({
      name: 'supplierId',
      val: this.data.supplierId
    });
    let obj = {
      entityName: 'DealContract',
      fields: fObj
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if (_) {
        this.notificationSvc.success('Запись успешно добавлена!');
        this.dialogRef.close(_);
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так!');
      }
    });
  }
}

@Component({
  selector: 'add-certificate-dialog',
  templateUrl: 'add-certificate-dialog.html',
})
export class AddCertificateDialog implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddCertificateDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient,
    private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      supplierMemberId: ['', Validators.required],
      name: ['', [Validators.required]],
      issueDate: ['', Validators.required],
      issuer: ['', [Validators.required]],
    });
  }
  onSaveClick(): void {
    this.save();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  save() {
    const href = `data-api/query/insert`;
    const requestUrl = `${href}`;
    let fObj = []
    for (let fName of Object.keys(this.formGroup.value)) {
      if (fName == 'issueDate') {
        let o = moment(this.formGroup.value[fName]).format('YYYY-MM-DD');
        fObj.push({
          name: fName,
          val: o
        });
      }
      else {
        fObj.push({
          name: fName,
          val: this.formGroup.value[fName]
        });
      }
    }
    fObj.push({
      name: 'supplierId',
      val: this.data.supplierId
    });
    let obj = {
      entityName: 'Certificate',
      fields: fObj
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if (_) {
        this.notificationSvc.success('Запись успешно добавлена!');
        this.dialogRef.close(_);
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так!');
      }
    });
  }
}
