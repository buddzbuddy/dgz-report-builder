import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { EntityformComponent } from '../material/entity-form/entity-form.component';
import { MaterialService } from '../material.service';
import { NotificationService } from '../notification.service';
import { FieldConfig, CollectionItem } from '../field.interface';
import { Validators } from '@angular/forms';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  columnsToDisplay: string[] = [];
  templateFields: any[] = [];
  columnCaptionsToDisplay2: any[] = [];
  selectCache: any = {};
  @ViewChild(MatSort, { static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Input() templateId: number = 0;
  @Input() localData: any[] = [];
  @Input() loadRequired: boolean = true;
  @Input() isSelect: boolean = false;
  @Input() isMultiSelect: boolean = false;
  @Input() hasAddBtn: boolean = true;
  @Input() fieldName: string = ''
  @Input() fieldValue: any
  @Output() selectResourceItem = new EventEmitter();
  @Output() checkResourceItem = new EventEmitter();
  searchKey: string;
  oDataItems: MatTableDataSource<any>;
  entityName: string;
  entityCaption: string;
  //templateId: number = 0;
  isLoadingResults = false;
  constructor(
    private odataSvc: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private materialSvc: MaterialService,
    private notificationSvc: NotificationService,
    private router: Router
    ) {
      this.isLoadingResults = true;
    }
  onSelectedResourceItem(selectedResourceItemId) {
    this.selectResourceItem.emit(selectedResourceItemId);
  }
  onCheckedResourceItem(resourceItemId, event) {
    this.checkResourceItem.emit({ resourceItemId, isChecked: event.checked });
  }
  ngOnInit() {
    this.initResources();
  }
  initResourceByTemplateId(query: string = '', label: string = ''){
    if(this.templateId == 0) return;
    this.odataSvc.getTemplateById(this.templateId).subscribe(template => {
      this.entityName = template.Name;
      this.entityCaption = label || template.Description;
      this.odataSvc.getFieldsByTemplateId(this.templateId).subscribe((tField) => {
        this.templateFields = tField.value;
        this.prepareSelectItems(tField.value);
        
        if(query != '') {
          this.odataSvc.filterODataResource(this.entityName, query).subscribe(data => {
            this.initTableDataSource(data.value);
          });
        }
        else if (this.loadRequired) {
          if(this.localData.length > 0) {
            this.initTableDataSource(this.localData);
          }
          else {
            this.odataSvc.getODataResource(this.entityName).subscribe(data => {
              this.initTableDataSource(data.value);
            });
          }
        } else {
          this.isLoadingResults = false;
        }
      });
    });
  }
  initTableDataSource(data: any[]) {
    this.oDataItems = new MatTableDataSource(data);
    this.createFields();
    this.oDataItems.sort = this.sort;
    this.oDataItems.paginator = this.paginator;
    this.oDataItems.filterPredicate = (data, filter) => {

      return this.columnsToDisplay.some(colName => {
        return (colName != 'actions') && 
              (
                (data[colName] && data[colName].toString().toLowerCase().indexOf(filter) != -1)
                ||
                (this.isSelectField(colName) ? this.displaySelectText(colName, data[colName]).toString().toLowerCase().indexOf(filter) != -1 : false)
                ||
                (this.isMultiSelectField(colName) ? this.displayMultiSelectTexts(colName, data[colName]).toString().toLowerCase().indexOf(filter) != -1 : false)
              );
      });
    };
    this.isLoadingResults = false;
  }
  prepareSelectItems(fields: any){
    for(let field of fields) {
      if(field.ElementType == 'select' || field.ElementType == 'multiselect') {
        this.storeSelectItems(field.Name, field.DefaultValue);
      }
    }
  }

  storeSelectItems(selectFieldName: string, templateId: number) {
    if(!this.selectCache[selectFieldName]){
      this.odataSvc.getTemplateById(templateId).subscribe(template => {
        this.odataSvc.getODataResource(template.Name).subscribe(data => {
          this.selectCache[selectFieldName] = data.value;
        });
      });
    }
  }

  isSelectField(column: string) : boolean {
    try {
      let field = this.templateFields.find((x) => x.Name == column);
      return field ? (field.ElementType == 'select') : false;
    } catch (error) {
      console.log(error, column);
      return false;
    }
  }

  isMultiSelectField(column: string) : boolean {
    
    try {
      let field = this.templateFields.find((x) => x.Name == column);
      return field ? (field.ElementType == 'multiselect') : false;
    } catch (error) {
      console.log(error, column);
      return false;
    }
  }

  isFileField(column: string) : boolean {
    
    try {
      let field = this.templateFields.find((x) => x.Name == column);
      return field ? (field.ElementType == 'image') : false;
    } catch (error) {
      console.log(error, column);
      return false;
    }
  }

  isDateField(column: string) : boolean {
    
    try {
      let field = this.templateFields.find((x) => x.Name == column);
      return field ? (field.ElementType == 'date') : false;
    } catch (error) {
      console.log(error, column);
      return false;
    }
  }
  displaySelectText(column: string, selectValue: number) : string {
    try {
      let displayName: string = 'Name';
      let selectItems = this.selectCache[column];
      if(selectItems) {
        let selectItemObj = selectItems.find((x) => x.Id == selectValue);
        if(selectItemObj) {
          for(let iPropName of Object.keys(selectItemObj)){
            if(iPropName.indexOf('Name') != -1){
              displayName = iPropName;
              break;
            }
          }
          return selectItemObj[displayName];
        }
      }
      return '';
    } catch (error) {
      console.log(error, column, selectValue);
      return 'error';
    }
  }
  displayMultiSelectTexts(column: string, selectedValues: any) : string {
    console.log('multiselect field recognized');
    try {
      let texts = '';
      let selectItems = this.selectCache[column];
      console.log('selectedValues', selectedValues);
      if(selectItems) {
        for(let selectValue of selectedValues){
          let selectItemObj = selectItems.find((x) => x.Id == selectValue);
          if(selectItemObj) {
            texts += selectItemObj.Name + ', ';
          }
        }
      }
      texts = texts.trim();
      if(texts.length > 0) {
        return texts.substring(0, texts.length - 1);
      }
      return '';
    } catch (error) {
      console.log(error, column, selectedValues);
      return 'error';
    }
  }

  initDynamicTemplates(){
    this.odataSvc.getDynamicTemplates().subscribe(data => {
      this.oDataItems = new MatTableDataSource(data.value);
      this.createFields();
      this.oDataItems.sort = this.sort;
      this.oDataItems.paginator = this.paginator;

      this.oDataItems.filterPredicate = (data, filter) => {
        return this.columnsToDisplay.some(ele => {
          return data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      };
      this.isLoadingResults = false;
    });
  }
  initResources(){
    this.isLoadingResults = true;
    if(this.templateId > 0) {
      this.initResourceByTemplateId();
    }
    else if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['templateId'] != null) {
          this.templateId = params['templateId'];

          if(params['bookmarkId'] != null) {
            this.hasAddBtn = false;
            this.odataSvc.getBookmark(parseInt(params['bookmarkId'])).subscribe(b => {
              this.initResourceByTemplateId(b.RouterLink, b.Title);
            });
          }
          else {
            this.initResourceByTemplateId();
          }
        }
        else {
          this.initDynamicTemplates();
        }
      });
    }
  }
  createFields(){
    this.columnsToDisplay = [];
    if(this.oDataItems.data.length > 0){
      let firstRow = this.oDataItems.data[0];
      Object.keys(firstRow).forEach((field) => {
        this.columnsToDisplay.push(field);
        let captionObj = this.templateFields.find((x) => x.Name == field);
        if(captionObj != null) this.columnCaptionsToDisplay2[field] = captionObj.Label;
        else this.columnCaptionsToDisplay2[field] = field;
      });
    }
  }
  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }
  applyFilter() {
    this.oDataItems.filter = this.searchKey ? this.searchKey.trim().toLowerCase() : '';
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
  onCreate(){
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
          resourceProperty.collections = this.getCollections(f.DefaultValue || 0);
        }
        if(f.InputType){
          resourceProperty.inputType = f.InputType;
        }
        if (this.fieldName != '' && this.fieldValue != null && f.Name == this.fieldName) {
          resourceProperty.value = parseInt(this.fieldValue);
        }
        resourceProperties.push(resourceProperty);
      }
      /*resourceProperties.push({
        type: "button",
        label: "Сохранить"
      });*/
      dialogConfig.data = {
        resourceName: this.entityName,
        resourceCaption: this.entityCaption,
        resourceId: this.templateId,
        resourceProperties
      }
      let d = this.dialog.open(EntityformComponent, dialogConfig);
      d.afterClosed().subscribe(dialogData => {
        if(dialogData.reload)
          this.initResources();
      });
    });
  }

  onDetails(row){
    this.router.navigate(['resources/' + this.templateId + '/viewItem/' + row['Id']]);
  }

  onEdit(element){
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
        if(element[f.Name]) {
          resourceProperty.value = element[f.Name]
        }
        resourceProperties.push(resourceProperty);
      }
      resourceProperties.push({
        name: "Id",
        label: "#",
        type: "input",
        inputType: "text",
        value: element['Id']
      });
      dialogConfig.data = {
        resourceName: this.entityName,
        resourceCaption: this.entityCaption,
        resourceId: this.templateId,
        resourceProperties
      }
      let d = this.dialog.open(EntityformComponent, dialogConfig);
      d.afterClosed().subscribe(dialogData => {
        if(dialogData.reload)
          this.initResources();
      });
    });
  }

  onDelete(Id){
    if(confirm('Вы уверены что хотите удалить эту запись?')){
      this.materialSvc.deleteResource(this.entityName, Id).then(_ => {
        this.notificationSvc.success('Deleted successfully');
        this.initResources();
      }).catch(_ => {
        this.notificationSvc.warn('! Deleting failed. See console logs to deails...');
      });
    }
  }
}
