import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss']
})
export class ViewItemComponent implements OnInit {
  @Input() templateId: number = 0;
  @Input() resourceItemId: number = 0;
  @Input() detailMode: boolean = true;
  resourceName: string = '';
  resourceLabel: string = '';
  fieldValues: any[] = [];
  subResources: any[] = [];
  fields: any[] = [];
  buttons: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private odataSvc: DataService
  ) { }

  ngOnInit() {
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

}
