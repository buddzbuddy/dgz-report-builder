import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppConfig } from './app.config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private webdatabase = `${AppConfig.settings.host}/webdatabase-${AppConfig.settings.dbPrefix}/`
  private oDataServiceURL = this.webdatabase + 'odata/'
  private metaServiceURL = this.webdatabase + 'ometa/'
  constructor(private http: HttpClient) { }

  postODataResource(entityName: string, data){
    const endpoint = `${this.oDataServiceURL}` + entityName;
    return this.http.post<any>(endpoint, data, httpOptions).pipe(
      tap(datas => this.log(`created OData resource of "${entityName}"`)),
      catchError(this.handleError('postDataToWcf', []))
    );
  }
  putODataResource(entityName: string, data){
    const endpoint = `${this.oDataServiceURL}` + entityName + `(${data.Id})`;
    return this.http.put<any>(endpoint, data, httpOptions).pipe(
      tap(datas => this.log(`updated OData resource of "${entityName}"`)),
      catchError(this.handleError('putODataResource', []))
    );
  }

  deleteODataResource(entityName: string, Id: number) {
    const endpoint = `${this.oDataServiceURL}` + entityName + `(${Id})`;
    return this.http.delete(endpoint, httpOptions).pipe(
      tap(datas => this.log(`deleted "${entityName}" from wcf data`)),
      catchError(this.handleError('deleteODataResource', null))
    );
  }

  getODataResource(entityName: string, selectFields: string = '*') {
    const endpoint = `${this.oDataServiceURL}` + entityName;
    const requestUrl = `${endpoint}?$select=${selectFields}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getODataResource "${entityName}" from wcf data`)),
      catchError(this.handleError('getODataResource', null))
    );
  }
  filterODataResource(entityName: string, query: string) {
    const endpoint = `${this.oDataServiceURL}` + entityName;
    const requestUrl = `${endpoint}?${query}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getODataResource "${entityName}" from wcf data`)),
      catchError(this.handleError('getODataResource', null))
    );
  }
  filterODataResourceExpanded(entityName: string, query: string) {
    const endpoint = `${this.oDataServiceURL}` + entityName;
    const requestUrl = `${endpoint}?$expand=*&${query}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getODataResource "${entityName}" from wcf data`)),
      catchError(this.handleError('getODataResource', null))
    );
  }

  getODataResourceItem(entityName: string, itemId: number) {
    const endpoint = `${this.oDataServiceURL}` + entityName + '(' + itemId + ')?$expand=*';
    const requestUrl = `${endpoint}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getODataResourceItem "${entityName}" from wcf data`)),
      catchError(this.handleError('getODataResourceItem', null))
    );
  }

  getODataResources() {
    const endpoint = `${this.oDataServiceURL}`;
    const requestUrl = `${endpoint}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getODataResources from wcf data`)),
      catchError(this.handleError('getListFromWcfData', null))
    );
  }
  getODataMetadata(){
    const endpoint = `${this.oDataServiceURL}`;
    const requestUrl = `${endpoint}$metadata`;
    return this.http.get(requestUrl, {
      ...httpOptions,
      responseType: "text"
    }).pipe(
      tap(datas => this.log(`get metadata from wcf data`)),
      catchError(this.handleError('getODataMetadata', null))
    );
  }
  getDynamicTemplates(){
    const endpoint = `${this.metaServiceURL}`;
    const requestUrl = `${endpoint}DynamicTemplates?$filter=IsExist eq 1`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getDynamicTemplates from wcf data`)),
      catchError(this.handleError('getDynamicTemplates', null))
    );
  }
  getTemplateById(templateId){
    const endpoint = `${this.metaServiceURL}`;
    const requestUrl = `${endpoint}DynamicTemplates(${templateId})`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getTemplateById from wcf data`)),
      catchError(this.handleError('getTemplateById', null))
    );
  }
  getFieldsByTemplateId(templateId){
    const endpoint = `${this.metaServiceURL}`;
    const requestUrl = `${endpoint}DynamicFields?$filter=TemplateId+eq+` + templateId + '+and+SqlTypeEnumCode+ne+null';
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getFieldsByTemplateId from wcf data`)),
      catchError(this.handleError('getFieldsByTemplateId', null))
    );
  }
  getButtonsByTemplateId(templateId){
    const endpoint = `${this.metaServiceURL}`;
    const requestUrl = `${endpoint}DynamicFields?$filter=TemplateId+eq+` + templateId + '+and+ElementType+eq+%27button%27';
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getFieldsByTemplateId from wcf data`)),
      catchError(this.handleError('getFieldsByTemplateId', null))
    );
  }

  getMenuItems(){
    const endpoint = `${this.metaServiceURL}`;
    const requestUrl = `${endpoint}MenuItems/?$filter=ParentMenuItemId%20eq%20null&$expand=MenuItems($expand=MenuItems($expand=MenuItems))`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getMenuItems from wcf data`)),
      catchError(this.handleError('getMenuItems', null))
    );
  }

  getTemplateIdByName(templateName: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/GetTemplateIdByName?name=${templateName}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getTemplateById from wcf data`)),
      catchError(this.handleError('getTemplateById', null))
    );
  }

  customApi_getPassportData(pin: string, passportSeries: string, passportNo: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/SOD/GetPassport?pin=${pin}&passportSeries=${passportSeries}&passportNo=${passportNo}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_getPassportData from wcf data`)),
      catchError(this.handleError('customApi_getPassportData', null))
    );
  }

  customApi_getISRTData(pin: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/SOD/GetUnemployeeStatus?pin=${pin}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_getISRTData from wcf data`)),
      catchError(this.handleError('customApi_getISRTData', null))
    );
  }

  customApi_GetActivePaymentsByPIN(pin: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/SOD/GetActivePaymentsByPIN?pin=${pin}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_getISRTData from wcf data`)),
      catchError(this.handleError('customApi_getISRTData', null))
    );
  }

  customApi_GetWorkPeriodInfo(pin: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/SOD/GetWorkPeriodInfo?pin=${pin}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_GetWorkPeriodInfo from wcf data`)),
      catchError(this.handleError('customApi_GetWorkPeriodInfo', null))
    );
  }

  customApi_TPBusinessActivityDateByInn(pin: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/SOD/TPBusinessActivityDateByInn?pin=${pin}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_TPBusinessActivityDateByInn from wcf data`)),
      catchError(this.handleError('customApi_TPBusinessActivityDateByInn', null))
    );
  }

  customApi_GetPassportByPIN(pin: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/SOD/GetPassportByPIN?pin=${pin}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_GetPassportByPIN from wcf data`)),
      catchError(this.handleError('customApi_GetPassportByPIN', null))
    );
  }

  customApi_acceptApp(appId: number) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/AppManage/Accept?appId=${appId}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_acceptApp from wcf data`)),
      catchError(this.handleError('customApi_acceptApp', null))
    );
  }

  customApi_rejectApp(appId: number, reason: string) {
    const endpoint = `${this.webdatabase}`;
    const requestUrl = `${endpoint}api/AppManage/Reject?appId=${appId}&reason=${reason}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`customApi_rejectApp from wcf data`)),
      catchError(this.handleError('customApi_rejectApp', null))
    );
  }

  getODatatResourceExpanded(entityName: string) {
    const endpoint = `${this.oDataServiceURL}` + entityName + '?$expand=*';
    const requestUrl = `${endpoint}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getODatatResourceExpanded from wcf data`)),
      catchError(this.handleError('getODatatResourceExpanded', null))
    );
  }

  getBookmarks(){
    const endpoint = `${this.metaServiceURL}`;
    const requestUrl = `${endpoint}Bookmarks`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getBookmarks from wcf data`)),
      catchError(this.handleError('getBookmarks', null))
    );
  }

  getBookmark(id: number){
    const endpoint = `${this.metaServiceURL}`;
    const requestUrl = `${endpoint}Bookmarks/${id}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getBookmark from ometa`)),
      catchError(this.handleError('getBookmark', null))
    );
  }

  postFile(file: File){
    let endpoint = '';
    if (location.port === '4202') { //use proxy
      endpoint = `/files/`;
    } else {
      endpoint = `http://${location.hostname}:${AppConfig.settings.file_port}/files/`;
    }

    return this.http.post(endpoint, file, {
      headers: new HttpHeaders({ 'fileName': this.transliterate(file.name) }),
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(datas => this.log(`postFile to odata`)),
      catchError(this.handleError('postFile', null))
    );
  }
  public a1 = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
  transliterate(word: string) : string {
    return word.split('').map((char) => {
      return this.a1[char] || char;
    }).join("");
  }
  getFiles(){
    let endpoint = '';
    if (location.port === '4202') { //use proxy
      endpoint = `/files/`;
    } else {
      endpoint = `http://${location.hostname}:${AppConfig.settings.file_port}/files/`;
    }
    const requestUrl = `${endpoint}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getFiles from odata`)),
      catchError(this.handleError('getFiles', null))
    );
  }

  getFile(id: string){
    let endpoint = '';
    if (location.port === '4202') { //use proxy
      endpoint = `/files('${id}')`;
    } else {
      endpoint = `http://${location.hostname}:${AppConfig.settings.file_port}/files('${id}')`;
    }
    const requestUrl = `${endpoint}`;
    return this.http.get(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`getFile from odata`)),
      catchError(this.handleError('getFile', null))
    );
  }

  deleteFile(id: string){
    let endpoint = '';
    if (location.port === '4202') { //use proxy
      endpoint = `/files('${id}')`;
    } else {
      endpoint = `http://${location.hostname}:${AppConfig.settings.file_port}/files('${id}')`;
    }
    const requestUrl = `${endpoint}`;
    return this.http.delete(requestUrl, httpOptions).pipe(
      tap(datas => this.log(`deleteFile from odata`)),
      catchError(this.handleError('deleteFile', null))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //console.log(message);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
