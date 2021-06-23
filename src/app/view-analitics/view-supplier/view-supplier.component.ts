import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private route: ActivatedRoute, private dialog: MatDialog,) { }
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

  addSupplierMember() {
    const dialogRef = this.dialog.open(AddSupplierMemberDialog, {
      data: {
        pin: ''
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.get_supplier_details();
      }
    });
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
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient, private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      username: ['', Validators.required],
      userPin: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]],
      email: ['', Validators.required],
      password: ['123456789', Validators.required],
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
      })
    }
    let obj = {
      entityName: 'MemberType',
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
