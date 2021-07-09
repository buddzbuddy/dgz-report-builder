import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './app-config.model';
@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    constructor(private http: HttpClient) { }
    load() {
        const jsonFile = `assets/config/config.json`;
        return new Promise<any>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: any) => {
                AppConfig.settings = <IAppConfig>response.appConfig;
                resolve({ host_keycloak: AppConfig.settings.host_keycloak, realm: AppConfig.settings.realm, clientId: AppConfig.settings.clientId, host_origin: AppConfig.settings.host_origin });
            }).catch((response: any) => {
                reject(`Could not load config.json file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}
