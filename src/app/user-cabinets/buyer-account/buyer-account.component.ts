import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AppConfig } from 'src/app/app.config';
import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-buyer-account',
  templateUrl: './buyer-account.component.html',
  styleUrls: ['./buyer-account.component.scss']
})
export class BuyerAccountComponent implements OnInit {

  constructor(private dialog: MatDialog, private _httpClient: HttpClient, private readonly keycloak: KeycloakService,) { }
  public isLoggedIn = false;
  //public userProfile: KeycloakProfile | null = null;
  public userToken: string
  buyer
  buyerId = 0
  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      //this.userProfile = await this.keycloak.loadUserProfile();
      this.userToken = await this.keycloak.getToken();
      this.getBuyerByUserId();
      this.getGrantedSources();
    }
  }
  getBuyerByUserId() {
    let uObj = this.getDecodedAccessToken(this.userToken);
    const href = 'data-api/supplier-requests/getBuyerByUserId/' + uObj.sub;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      console.log(_);
      this.buyer = _;
      this.buyerId = _.id;
      this.getComplaintsByBuyerId();
    });
  }

  complaints = [];
  getComplaintsByBuyerId() {
    const href = 'data-api/supplier-requests/getComplaintsByBuyerId/' + this.buyerId;
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.complaints = _;
    });
  }
  buyerSupplierRegistryChecked = false
  getGrantedSources() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, { rootName: 'GrantedSource' }).subscribe(_ => {
      if (_['data'] != null) {
        let grantedSources: any[] = _['data'];
        for (let index = 0; index < grantedSources.length; index++) {
          const gSource = grantedSources[index];
          if (gSource.sourceType == 'BUYER_SUPPLIER_REGISTRY') {
            this.buyerSupplierRegistryChecked = true;
          }
        }
      }
    })
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
  editing = false;
  editObj
  edit() {
    this.editObj = {
      ...this.buyer
    }
    this.editing = true;
  }
  cancel() {
    this.editing = false;
  }
  addComplaint() {
    const dialogRef = this.dialog.open(AddComplaintDialog, {
      data: {
        buyerId: this.buyerId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        this.getComplaintsByBuyerId();
      }
    });
  }
}

@Component({
  selector: 'add-complaint-dialog',
  templateUrl: 'add-complaint-dialog.html',
})
export class AddComplaintDialog implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddComplaintDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient,
    private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      complaintTypeId: ['', Validators.required],
      description: ['', [Validators.required]],
    });
    this.loadComplaintTypes();
  }
  selected = null;
  selectSupplier(s) {
    this.selected = s;
  }
  deselectSupplier() {
    this.selected = null;
    this.suppliers = [];
  }
  onSaveClick(): void {
    this.save();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  inn: string = '';
  suppliers: [];
  findSupplier() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: "Supplier",
      searchFitler: [
        {
          property: 'inn',
          operator: '=',
          value: this.inn
        }
      ]
    }
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.suppliers = _['data'];
    });
  }
  complaintTypes: any[] = [];
  loadComplaintTypes() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: "ComplaintType"
    }
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.complaintTypes = _['data'];
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
      name: 'buyerId',
      val: this.data.buyerId
    });
    fObj.push({
      name: 'supplierId',
      val: this.selected.id
    });
    let obj = {
      entityName: 'Complaint',
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
