import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as rutoken from 'rutoken';
import { AppConfig } from '../app.config';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router,private readonly keycloak: KeycloakService,  public dialog: MatDialog, private localStorageSvc: LocalStorageService,) { }
  public isLoggedIn = false;
  public userProfile: any//: KeycloakProfile | null = null;


public loginK() {
  this.keycloak.login();
}

public loginEZP() {
  const dialogRef = this.dialog.open(LoginRutokenDialog);
  dialogRef.afterClosed().subscribe(_ => {
    if(_ != null) {
      console.log(_);
      this.userProfile = _;
      this.isLoggedIn = true;
      this.localStorageSvc.save('ezpInfo', _);
    }
  });
}

public logout() {
  this.isLoggedIn = false;
  this.keycloak.isLoggedIn().then(_ => {
    if(_) {
      this.keycloak.logout();
    }

    if(this.localStorageSvc.has('ezpInfo')) {
      this.localStorageSvc.remove('ezpInfo');
      this.userProfile = null;
    }
  });

}
  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
    else {
      if(this.localStorageSvc.has('ezpInfo')) {
        this.userProfile = this.localStorageSvc.get('ezpInfo');
        this.isLoggedIn = true;
      }
    }
  }

  goto(url){
    setTimeout(() => {
      this.router.navigate([url]);
    }, 1000);
  }

}



@Component({
  selector: 'login-rutoken-dialog',
  templateUrl: 'login-rutoken-dialog.html',
})
export class LoginRutokenDialog implements OnInit {

plugin: any

  constructor(
    public dialogRef: MatDialogRef<LoginRutokenDialog>, private _httpClient: HttpClient,) {}

    ngOnInit() {
      rutoken.ready
      // Проверка установки расширение 'Адаптера Рутокен Плагина' в Google Chrome
      .then(() => {
        console.log('rutoken.ready')
        rutoken.isExtensionInstalled()
        // Проверка установки Рутокен Плагина
      .then((result) => {
        if (result) {
          rutoken.isPluginInstalled()
          // Загрузка плагина
      .then((result) => {
        if (result) {
          rutoken.loadPlugin()

      // Можно начинать работать с плагином
      .then((result) => {
        if (!result) {
          return alert("Не удаётся загрузить Плагин");
        } else {
          this.plugin = result;
          console.log('plugin loaded');
          this.getEZPInfo();
        }
      });
        } else {
          alert("Не удаётся найти Плагин");
        }
      });
        } else {
          alert("Не удаётся найти расширение 'Адаптер Рутокен Плагина'");
        }
      });
      });
    }
  onLoginClick(): void {
    this.pr = this.plugin.login(this.rutokenHandle, this.pin /*"240699"*/);
    this.fetchDataFromEZP();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  onOkClick(): void {
    this.dialogRef.close(this.foundObj);
  }
  progress = 'Загрузка ЭЦП...'

rutokenHandle
certHandle
certData
cmsData
/////////////////////////////////////////
pinEnabled = false;
pin = ''
pr: Promise<void>
getEZPInfo()
{
  // Перебор подключенных Рутокенов
  this.plugin.enumerateDevices()
  .then((devices) => {
    if (devices.length > 0) {
      let firstDevice = devices[0];
      // Проверка залогиненности
      this.rutokenHandle = firstDevice;
      this.plugin.getDeviceInfo(this.rutokenHandle, this.plugin.TOKEN_INFO_IS_LOGGED_IN)
  // Логин на первый токен в списке устройств PIN-кодом по умолчанию
  .then((isLoggedIn) => {
    console.log('isLoggedIn', isLoggedIn);
    if (isLoggedIn) {
      this.pr = Promise.resolve();
      this.fetchDataFromEZP();
    } else {
      this.pinEnabled = true;
    }

  })
    } else {
      //swal("Рутокен не обнаружен");
      alert("Рутокен не подключен!")
    }
  })

}
handleError(reason) {
  if (isNaN(reason.message)) {
    console.log(reason);
  } else {
    var errorCodes = this.plugin.errorCodes;
    switch (parseInt(reason.message)) {
      case errorCodes.PIN_INCORRECT:
        alert("Неверный PIN");
        break;
      case errorCodes.ALREADY_LOGGED_IN:
        alert("Уже вошли! Обновите страницу!");
      default:
        console.log("RUTOKEN", { codes: this.plugin.errorCodes, reason});
    }
  }
}
fetchDataFromEZP() {
  this.progress = 'Считывание данных с ЭЦП...'
  // Перебор пользовательских сертификатов на токене
  this.pr.then(() => {
    this.plugin.enumerateCertificates(this.rutokenHandle, this.plugin.CERT_CATEGORY_UNSPEC)
    .then((certs) => {
      if (certs.length > 0) {
        this.certHandle = certs[0];
        this.plugin.parseCertificate(this.rutokenHandle, certs[0])
  // Подписание данных из текстового поля на первом найденом сертификате
  .then((cert) => {
    this.certData = cert
    if (this.certHandle.length > 0) {
      let inn = ""
      for(let i=0; i<this.certData.subject.length; i++){
        if(this.certData.subject[i].rdn === "serialNumber"){
          inn = this.certData.subject[i].value
        }
      }

      console.log("EZP", inn);
      this.progress = 'Данные найдены, авторизация на сервере...'
      this.checkPinInSSO(inn, this.certData);
      this.plugin.logout(this.rutokenHandle);
    } else {
      alert("Сертификат на Рутокен не обнаружен")
    }
  });
      }  else {
        alert("Сертификат на Рутокен не обнаружен");
      }
    });
  },
  err => this.handleError(err));
}


checkPinInSSO(inn: string, ezpInfo: any) {
  const params = new HttpParams({
    fromObject: {
      grant_type: 'password',
      username: AppConfig.settings.t_username,
      password: AppConfig.settings.t_password,
      client_id: AppConfig.settings.temp_clientId,
      client_secret: AppConfig.settings.client_secret,
      scope: 'openid'
    }
  });

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      //'Authorization': 'Basic ' + btoa('yourClientId' + ':' + 'yourClientSecret')
    })
  };

  this._httpClient.post(AppConfig.settings.host_keycloak + 'auth/realms/dgz/protocol/openid-connect/token', params, httpOptions)
    .subscribe(
      (res: any) => {
        this.findInUsers(res.access_token, inn, ezpInfo);
      },
      err => console.log(err)
    );
}
findInUsers(token: string, inn: string, expInfo: any) {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    })
  };

  this._httpClient.get(AppConfig.settings.host_keycloak + 'auth/admin/realms/dgz/users/?20000', httpOptions)
    .subscribe(
      (res: any) => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          const u = res[i];
          if(u.attributes['userPin'] != null && u.attributes['userPin'][0] == inn) {
            this.foundObj = u;
            this.progress = 'Пользователь успешно авторизован!'
            break;
          }
        }
        if(this.foundObj == null) {
          this.progress = 'Для данного пользователя доступ отсутствует! Обратитесь к администратору за доступом.'
        }
      },
      err => console.log(err)
    );
}
foundObj = null;
}
