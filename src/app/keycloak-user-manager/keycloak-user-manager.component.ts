import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-keycloak-user-manager',
  templateUrl: './keycloak-user-manager.component.html',
  styleUrls: ['./keycloak-user-manager.component.scss']
})
export class KeycloakUserManagerComponent implements /*OnInit, */AfterViewInit {

  constructor(private _httpClient: HttpClient, public dialog: MatDialog, private router: Router) {
  }

  pin = ''
  ngOnInit(): void {
    //this.loadUsers();
  }

  loadUsers() {
    this._httpClient.get<any[]>(AppConfig.settings.host_keycloak + 'auth/admin/realms/dgz/users/?20000').subscribe(_ => {
      _.map(u => {
        if (u.attributes.userRole != null) {
          this.dgzUsers.push({
            ...u,
            userPin: u.attributes.userPin != null ? u.attributes.userPin[0] : '-',
            userRole: u.attributes.userRole != null ? u.attributes.userRole[0] : '-'
          });
        }
        else if (u.attributes.orgType != null) {
          let nu = {
            ...u,
            orgPin: u.attributes.orgPin != null ? u.attributes.orgPin[0] : '-',
            orgName: u.attributes.orgName != null ? u.attributes.orgName[0] : '-',
            position: u.attributes.position != null ? u.attributes.position[0] : '-',
            telephone: u.attributes.telephone != null ? u.attributes.telephone[0] : '-',
          }
          if (u.attributes.orgType[0] == 'buyer') {
            this.buyerUsers.push(nu);
          }
          else if (u.attributes.orgType[0] == 'supplier') {
            this.supplierUsers.push(nu);
          }
        }
      });
      this.dgzUsersSrc = new MatTableDataSource(this.dgzUsers);
      this.dgzUsersSrc.paginator = this.dgzPaginator;
      this.dgzUsersSrc.sort = this.dgzSort;
      this.buyerUsersSrc = new MatTableDataSource(this.buyerUsers);
      this.supplierUsersSrc = new MatTableDataSource(this.supplierUsers);
    });
  }
  dgzUsers = []
  buyerUsers = []
  supplierUsers = []

  goMain() {
    this.router.navigate(['/']);
  }

  addUser() {
    const dialogRef = this.dialog.open(AddKeycloakUserDialog, {
      data: {
        pin: this.pin
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_ != null) {
        console.log(_);
        this.loadUsers();
      }
    });
  }
  dgzDisplayedColumns: string[] = ['createdTimestamp', 'username', 'firstName', 'lastName', 'email', 'userPin', 'userRole'];
  dgzUsersSrc: MatTableDataSource<any>;
  @ViewChild("dgzPaginator", { static: true }) dgzPaginator: MatPaginator;
  @ViewChild("dgzSort", { static: true }) dgzSort: MatSort;

  buyerDisplayedColumns: string[] = ['createdTimestamp', 'orgPin', 'orgName', 'username', 'firstName', 'lastName', 'position', 'telephone', 'email'];
  buyerUsersSrc: MatTableDataSource<any>;
  @ViewChild("buyerPaginator", { static: true }) buyerPaginator: MatPaginator;
  @ViewChild("buyerSort", { static: true }) buyerSort: MatSort;

  supplierDisplayedColumns: string[] = ['createdTimestamp', 'orgPin', 'orgName', 'username', 'firstName', 'lastName', 'position', 'telephone', 'email', 'action'];
  supplierUsersSrc: MatTableDataSource<any>;
  @ViewChild("supplierPaginator", { static: true }) supplierPaginator: MatPaginator;
  @ViewChild("supplierSort", { static: true }) supplierSort: MatSort;


  ngAfterViewInit() {
    this.loadUsers();

  }
  applyFilterDgz(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dgzUsersSrc.filter = filterValue.trim().toLowerCase();

    if (this.dgzUsersSrc.paginator) {
      this.dgzUsersSrc.paginator.firstPage();
    }
  }
  applyFilterBuyer(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.buyerUsersSrc.filter = filterValue.trim().toLowerCase();

    if (this.buyerUsersSrc.paginator) {
      this.buyerUsersSrc.paginator.firstPage();
    }
  }
  applyFilterSupplier(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.supplierUsersSrc.filter = filterValue.trim().toLowerCase();

    if (this.supplierUsersSrc.paginator) {
      this.supplierUsersSrc.paginator.firstPage();
    }
  }

  viewSupplier(userId) {
    this._httpClient.get<any>(AppConfig.settings.host + `data-api/supplier-requests/getSupplierByUserId/${userId}`).subscribe(_ => {
      console.log(_);
      if (_.id > 0) {
        this.router.navigate(['/analitics/view-supplier/' + _.id]);
      }
    });
  }
}


@Component({
  selector: 'add-keycloak-user-dialog',
  templateUrl: 'add-keycloak-user-dialog.html',
})
export class AddKeycloakUserDialog implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddKeycloakUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient, private _formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      username: ['', Validators.required],
      userPin: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]],
      email: ['', Validators.required],
      password: ['123456789', Validators.required],
    });
    this.loadRoles();
  }
  conditions: any = {

  }
  onSaveClick(): void {
    this.saveUser();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  selectedRoleName = ''
  roles = []
  loadRoles() {
    const href = 'data-api/user-constraint/role/getAll';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.roles = _;
    });
  }

  errorMessage = ''
  reqStatus = 0
  selectItemsForSrc: any = {}
  saveUser() {
    const href = `auth/admin/realms/dgz/users`;
    const requestUrl = `${href}`;
    let obj = this.formGroup.value;
    let userPin = obj['userPin'];
    let userPass = obj['password'];
    delete obj['userPin'];
    delete obj['password'];
    let data =
    {
      ...obj,
      emailVerified: true,
      enabled: true,
      requiredActions: ["UPDATE_PASSWORD"],
      attributes:
      {
        userPin: [userPin],
        userRole: [this.selectedRoleName]
      },
      credentials: [
        {
          type: "password",
          value: userPass
        }
      ]
    }
    this.errorMessage = '';
    this.reqStatus = 0;
    this._httpClient.post<any>(AppConfig.settings.host_keycloak + requestUrl, data).subscribe(_ => {
      this.dialogRef.close(true);
    },
      err => {
        if (err.status == 409) {
          this.errorMessage = "Такой логин уже присвоен!";
        }
        else {
          this.errorMessage = err.message;
        }

        console.log('ошибка', err);
      });
  }
}
