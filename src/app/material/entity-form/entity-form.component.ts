import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Validators } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaterialService } from 'src/app/material.service';
import { NotificationService } from 'src/app/notification.service';
import { DataService } from 'src/app/data.service';

import * as moment from 'moment';

@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html'
})
export class EntityformComponent implements OnInit {
  @ViewChild(DynamicFormComponent, { static: true }) form: DynamicFormComponent;

  resourceProperties: FieldConfig[] = [];
  resourceCaption: string;
  resourceName: string;
  resourceId: string;
  constructor(
    public dialogRef: MatDialogRef<EntityformComponent>,
  @Inject(MAT_DIALOG_DATA) data,
  private service: MaterialService,
  private odataSvc: DataService,
  private notificationSvc: NotificationService,
){
  if(data == null || data.resourceName == null || data.resourceId == null)
  throw new Error("Required data.resourceName or data.resourceId doesn't exist in the MatDialogConfig!");
  if(data.resourceProperties == null || !data.resourceProperties.length)
  throw new Error("Required data.resourceProperties doesn't exist in the MatDialogConfig!");
  this.resourceName = data.resourceName;
  this.resourceCaption = data.resourceCaption;
  this.resourceId = data.resourceId;
  this.resourceProperties = data.resourceProperties;
}
  submit(value: any) {
      console.log('form submitted:', this.form.value);

      let resObj = this.form.value;
      if (resObj.Id) {
        this.service.updateResource(this.resourceName, resObj).then(_ => {
          this.notificationSvc.success('Updated successfully');
          this.onClose({reload: true});
        }).catch(_ => {
          this.notificationSvc.warn('Updateing failed. See console logs to deails...');
        });
      }
      else {
        try {

          resObj.CreatedAt = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ');
          if(true) {
            //resObj.UserId = this.oauthService.getIdentityClaims()['sub'];
          }
          this.odataSvc.postODataResource(this.resourceName, resObj).subscribe((data) => {
            this.notificationSvc.success('Created successfully');
            this.onClose({reload: true});
          });
        } catch (error) {
          this.notificationSvc.warn('Creating failed. See console logs to deails...');
          throw error;
        }
      }
  }
  ngOnInit() {
    //this.resourceName = this.dialogRef.componentInstance.resourceName;
  }

  onClose(closeParam = {reload: false}){
    this.dialogRef.close(closeParam);
  }
}
