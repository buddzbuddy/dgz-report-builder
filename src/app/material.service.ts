import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DataService } from './data.service';
//import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  oDataItems: any[] = [];
  departments: any[] = [];
  constructor(
    private odataSvc: DataService
  ) { }

  getResource(entityName: string){
    this.odataSvc.getODataResource(entityName).subscribe(data => {
      this.oDataItems = data.value;
    });
  }

  insertResource(entityName: string, obj){
    let promise = new Promise((resolve, reject) => {
      this.odataSvc.postODataResource(entityName, obj)
        .toPromise()
        .then(
          res => { // Success

          resolve();
          },
          msg => { // Error
          reject(msg);
          }
        );
    });
    return promise;
  }

  updateResource(entityName: string, obj){
    let promise = new Promise((resolve, reject) => {
      this.odataSvc.putODataResource(entityName, obj)
        .toPromise()
        .then(
          res => { // Success

          resolve();
          },
          msg => { // Error
          reject(msg);
          }
        );
    });
    return promise;
  }

  deleteResource(entityName: string, Id){
    let promise = new Promise((resolve, reject) => {
      this.odataSvc.deleteODataResource(entityName, Id)
        .toPromise()
        .then(
          res => { // Success

          resolve();
          },
          msg => { // Error
          reject(msg);
          }
        );
    });
    return promise;
  }

  getDepartments(){
    this.odataSvc.getODataResource('Departments').subscribe(data => {
      this.departments = data.value;
    });
  }
  fillForm(row) {
    //this.form.setValue(row);
  }
}
