import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment'
import { Subject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FieldConfig, CollectionItem } from 'src/app/field.interface';
import { Validators } from '@angular/forms';
import { EntityformComponent } from 'src/app/material/entity-form/entity-form.component';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss']
})
export class ViewItemComponent implements OnInit {
  @Input() templateId: number = 0;
  @Input() resourceItemId: number = 0;
  @Input() detailMode: boolean = true;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  resourceName: string = '';
  resourceLabel: string = '';
  fieldValues: any[] = [];
  subResources: any[] = [];
  fields: any[] = [];
  buttons: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private odataSvc: DataService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.resetFormSubject.subscribe(response => {
      if(response){
        this.initComponent();
    }
   })
    if (this.templateId != 0 && this.resourceItemId != 0) {
      this.initComponent();
    }
    else if (this.route.params != null) {
      this.route.params.subscribe(params => {
          if (params['templateId'] != null && params['resourceItemId'] != null) {
          this.templateId = params['templateId'];
          this.resourceItemId = params['resourceItemId'];
          this.initComponent();
        }
      });
    }
  }
  parseResourceNameToField(resName: string) : string {
    return resName.substring(0, this.resourceName.length - 1) + 'Id';
  }
  getFirstFieldName(fieldValues: any): string {
    let fieldName = 'Name';
    if(fieldValues) {
      for(let iPropName of Object.keys(fieldValues)){
        if(iPropName.indexOf('Name') != -1){
          fieldName = iPropName;
          break;
        }
      }
      return fieldName;
    }
    return 'Name';
  }
  convertToDate(dateStr: any) {
    return dateStr != null ? moment(dateStr).format('DD.MM.YYYY HH:mm') : '';
  }
  initComponent(){
    this.odataSvc.getTemplateById(this.templateId).subscribe(t => {
      this.resourceName = t.Name;
      this.resourceLabel = t.Description;
      this.odataSvc.getFieldsByTemplateId(this.templateId).subscribe(data => {
        this.fields = data.value;
        this.odataSvc.getODataResourceItem(this.resourceName, this.resourceItemId || 0).subscribe(data => {
          this.fieldValues = data || {};
          Object.keys(this.fieldValues).forEach((fName) => {
            if(this.fieldValues[fName] instanceof Array) {
              if(this.fieldValues[fName].length > 0){
                this.odataSvc.getTemplateIdByName(fName).subscribe(tmplId => {
                  this.subResources.push({
                    templateId: tmplId,
                    localData: this.fieldValues[fName],
                    foreignKey: this.parseResourceNameToField(this.resourceName),
                    loadRequired: true
                  });
                });
              } else {
                this.odataSvc.getTemplateIdByName(fName).subscribe(tmplId => {
                  this.subResources.push({
                    templateId: tmplId,
                    foreignKey: this.parseResourceNameToField(this.resourceName),
                    loadRequired: false
                  });
                });
              }
            }
          });
        });
      });
    });
    this.odataSvc.getButtonsByTemplateId(this.templateId).subscribe(data => {
      this.buttons = data.value;
    });
  }

  getCollections(resourceId: number, displayName: string = 'Name', valueName: string = 'Id'): CollectionItem[] {
    let resourceItems: CollectionItem[] = [];
    this.odataSvc.getTemplateById(resourceId).subscribe(template => {
      this.odataSvc.getODataResource(template.Name).subscribe(_ => {
        for(let i of _.value){
          for(let iPropName of Object.keys(i)){
            if(iPropName.indexOf('Name') != -1){
              displayName = iPropName;
              break;
            }
          }
          resourceItems.push({ text: (i[displayName] || '-'), id: (i[valueName] || 0) });
        }
      });
    });
    resourceItems = resourceItems.sort((a,b)=>a.text.localeCompare(b.text));
    //console.log(resourceItems);
    return resourceItems;
  }

  onEditClicked(){
    this.odataSvc.getODataResourceItem(this.resourceName, this.resourceItemId).subscribe(obj => {
      this.onEdit(obj);
    })
  }
  onEdit(itemObj){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.height = "90%";

    const resourceProperties: FieldConfig[] = [];
    this.odataSvc.getFieldsByTemplateId(this.templateId).subscribe(data => {
      for (let f of data.value) {
        let resourceProperty: FieldConfig = {
          name: f.Name,
          label: f.Label,
          type: f.ElementType
        };
        if(!f.IsNullable) {
          resourceProperty.validations = [
            {
              name: 'required',
              validator: Validators.required,
              message: f.Label + ' обязательно к заполнению'
            }
          ];
        }
        if(f.ElementType == 'select' || f.ElementType == 'multiselect') {
          resourceProperty.collections = this.getCollections(f.DefaultValue);
        }
        if(f.InputType){
          resourceProperty.inputType = f.InputType;
        }
        if(itemObj[f.Name]) {
          resourceProperty.value = itemObj[f.Name]
        }
        resourceProperties.push(resourceProperty);
      }
      resourceProperties.push({
        name: "Id",
        label: "#",
        type: "input",
        inputType: "text",
        value: itemObj['Id']
      });
      dialogConfig.data = {
        resourceName: this.resourceName,
        resourceCaption: this.resourceLabel,
        resourceId: this.templateId,
        resourceProperties
      }
      let d = this.dialog.open(EntityformComponent, dialogConfig);
      d.afterClosed().subscribe(dialogData => {
        if(dialogData.reload)
          this.initComponent();
      });
    });
  }
}
