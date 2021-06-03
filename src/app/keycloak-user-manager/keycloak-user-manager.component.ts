import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-keycloak-user-manager',
  templateUrl: './keycloak-user-manager.component.html',
  styleUrls: ['./keycloak-user-manager.component.scss']
})
export class KeycloakUserManagerComponent implements OnInit {

  constructor(private _httpClient: HttpClient,  public dialog: MatDialog, private router: Router ) { }
  users = []
  pin = ''
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this._httpClient.get<any>(AppConfig.settings.host_keycloak + 'auth/admin/realms/dgz/users/?20000').subscribe(_ => {
      this.users = _;
    });
  }

  goMain() {
    this.router.navigate(['/']);
  }

  addUser(){
    const dialogRef = this.dialog.open(AddKeycloakUserDialog, {
      data: {
        pin: this.pin
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if(_ != null) {
        console.log(_);
        this.loadUsers();
        //this.availableSources.push(_);
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
    @Inject(MAT_DIALOG_DATA) public data, private _httpClient: HttpClient, private _formBuilder: FormBuilder, ) {}

    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        username: ['', Validators.required],
        userPin: ['', [Validators.required]],
        firstName: ['', Validators.required],
        lastName: ['', [Validators.required]],
        email: ['', Validators.required],
      });
    }
    conditions: any = {

    }
  onSaveClick(): void {
    this.saveUser();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }

  errorMessage = ''
  reqStatus = 0
  selectItemsForSrc: any = {}
  saveUser() {
    const href = `auth/admin/realms/dgz/users`;
    const requestUrl = `${href}`;
    let obj = this.formGroup.value;
    let userPin = obj['userPin'];
    delete obj['userPin'];
    let data =
    {
      ...obj,
      emailVerified: true,
      enabled: true,
      requiredActions: ["UPDATE_PASSWORD"],
      attributes:
      {
        userPin: [userPin],
        userRole: ["operator"]
      },
      credentials: [
        {
            type: "password",
            value: "123456789"
        }
      ]
    }
    this.errorMessage = '';
    this.reqStatus = 0;
    this._httpClient.post<any>(AppConfig.settings.host_keycloak + requestUrl, data).subscribe(_ => {
      this.dialogRef.close(true);
    },
    err => {
      if(err.status == 409) {
        this.errorMessage = "Такой логин уже присвоен!";
      }
      else {
        this.errorMessage = err.message;
      }

      console.log('ошибка', err);
    });
  }
}