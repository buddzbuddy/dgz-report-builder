import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './app-config.model';
import { AuthConfig } from 'angular-oauth2-oidc';
@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    static authConfig: AuthConfig;
    constructor(private http: HttpClient) {}
    load() {
        const jsonFile = `assets/config/config.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: any) => {
               AppConfig.settings = <IAppConfig>response.appConfig;
               AppConfig.authConfig = <AuthConfig>response.authConfig;
               AppConfig.authConfig.requireHttps = false;
               resolve();
            }).catch((response: any) => {
               reject(`Could not load config.json file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}