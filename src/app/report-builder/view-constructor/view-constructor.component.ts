import { Component, Inject, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-constructor',
  templateUrl: './view-constructor.component.html',
  styleUrls: ['./view-constructor.component.scss']
})
export class ViewConstructorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private _httpClient: HttpClient, public dialog: MatDialog,  ) { }
    className: string
  ngOnInit() {

    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['className'] != null) {
          this.className = params['className'];
          this.conditions = {
            entityName: this.className,
            filters: []
          }
          this.getSourceDetails();
        }
      });
    }
  }

  download(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(blob, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
  exportJson(): void {
    console.log(this.conditions)
    const c = JSON.stringify(this.conditions);
    const file = new Blob([c], {type: 'text/json'});
    this.download(file,"fileName.json");
  }
  fields = []
  offline_fields = []
  selected_fields = []

  getSourceFields(){
    this.fields = this.sourceObj.propList;
    let conditionFields = []
    this.fields.forEach(val => conditionFields.push(Object.assign({}, val)));
    //console.log(conditionFields)
    this.offline_fields = conditionFields;
    this.loadSelectItems();
    //this.emitEventToChild();
    /*const href = `data-api/datasources/${this.datasourceId}/fields/`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.fields = _;
    });
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.offline_fields = _;
    });*/
  }
  sourceObj:any = {}
  getSourceDetails(){
    const href = `data-api/query/getMeta/${this.className}`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.sourceObj = _;
      this.queryConfig = {
        rootEntity: _['dbName'],
        joins: [],
        selects: [],
        conditions: []
      }
      this.getSourceFields();
      this.calcAvailableSources();
    });
  }
  selectedFile
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");
    fileReader.onload = () => {
      const resStr = fileReader.result;
      let resObj = JSON.parse(fileReader.result.toString());
      console.log("UPLOADED", resObj);
      this.conditions = resObj;
      this.importedVals = resObj.filters;
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
  importedVals = []
  moveAll(){
    this.fields.forEach(f => {
      this.selected_fields.push(f)
    });
    this.fields = []
    this.emitEventToChild();
  }
  goBack(){
    window.history.back();
  }
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log('inside container');
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      console.log('another container');
    }
    this.emitEventToChild();
  }
  conditions = {
    entityName: '',
    filters: []
  }
  updateConditions(c:any[]){
    console.log('conditions updated', c);
    this.conditions.filters = c;
  }
  isLoading = false
  data = []
  fetchData() {
    const href = `data-api/query/exec`;
    const requestUrl = `${href}`;
    let paramList = this.conditions.filters;

    /*for (let i = 0; i < Object.keys(this.conditions).length; i++) {
      const el = Object.keys(this.conditions)[i];
      paramList.push({
        property: el,
        operator: "=",
        value: this.conditions[el]
      })
    }*/
    let obj = {
      rootName: this.sourceObj.className,
      searchFitler: paramList
    }
    this.isLoading = true;
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if(_.result) {
        this.data = _.data;
        this.isLoading = false;
        //this.emitEventToChild();
      }
    });
  }
  eventsSubject: Subject<void> = new Subject<void>();

emitEventToChild() {
  this.eventsSubject.next();
}

selectItems = {}
  loadSelectItems() {
    const href = `data-api/query/exec`;
const requestUrl = `${href}`;
    this.offline_fields.forEach(f => {
      if(f.dataType == 'long' && f.dictionaryClassName != null) {
    let obj = {
      rootName: f.dictionaryClassName
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if(_.result) {
        this.selectItems[f.name] = _.data;
      }
    });
      }
    });
  }

  queryConfig: JsonSqlModel;
  queryString: string;

  buildSql() {
    let sql = `
SELECT
{selects}
FROM {root} t0
{joins}
{conditions}
    `;
    sql = sql.replace('{root}', this.queryConfig.rootEntity);
    sql = sql.replace('{selects}', this.buildSelects());
    sql = sql.replace('{joins}', this.buildJoins());
    sql = sql.replace('{conditions}', (this.queryConfig.conditions.length ? '1' : ''));
    this.queryString = sql;
  }
  buildJoins() : string {
    let s = '';

    for (let i = 0; i < this.queryConfig.joins.length; i++) {
      const j = this.queryConfig.joins[i];
      s += `INNER JOIN ${j.entityTo} ${j.alias} on ${j.fkField}=${j.pkField}`
      s += '\n';
    }

    return s;
  }
  buildSelects() : string {
    let s = '*';
    let sList: string[] = []
    for (let i = 0; i < this.queryConfig.selects.length; i++) {
      const el = this.queryConfig.selects[i];
      sList.push(`${el.entityFor}.${el.field} as ${el.alias}`);
    }

    if(sList.length) {
      s = sList.join(', ');
    }

    return s;
  }
  allSources = []
  calcAvailableSources(){
    const href = `data-api/query/getMeta/`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.allSources = _['data'];
      this.calcInternalSources(this.sourceObj);
    });
  }
  availableSources = []
  calcInternalSources(srcObj){
    let res = this.getInternalSources(srcObj);
    res.map(_ => this.availableSources.push(_));
  }

  getInternalSources(srcObj): any[] {
    let res = [];

    for (let i = 0; i < srcObj.propList.length; i++) {
      const f = srcObj.propList[i];
      if(f['dictionaryClassName'] != null) {
        let className = f['dictionaryClassName'];
        for (let j = 0; j < this.allSources.length; j++) {
          const s = this.allSources[j];
          if(s['className'] == className) {
            res.push({s, f});
          }
        }
      }
    }
    return res;
  }

  calcExternalSources(){

  }

  selectedSources = []
  selectSource(sf) {
    this.selectedSources.push(sf);

    this.calcJoin(sf);

    let oldList = this.availableSources;
    this.availableSources = [];
    for (let i = 0; i < oldList.length; i++) {
      const oldS = oldList[i];
      if(oldS.s['className'] != sf.s['className']) {
        this.availableSources.push(oldS);
      }
    }
  }
  calcJoin(sf){
    let tAlias = 't'+(this.queryConfig.joins.length+1);
    let pkField = tAlias + '.id';
    let fkField = 't0.' + sf.f.dbName;
    this.queryConfig.joins.push(
      {
        entityTo: sf.s.dbName,
        alias: tAlias,
        pkField: pkField,
        fkField: fkField
      }
    )
  }

  hasSubSources(src):boolean{
    let sList = this.getInternalSources(src.s);
    return sList.length > 0;
  }
  addSubSource(src){
    let sList = this.getInternalSources(src.s);
    console.log(sList);
    const dialogRef = this.dialog.open(AddSubSourceDialog, {
      data: sList
    });
    dialogRef.afterClosed().subscribe(_ => {
      if(_ != null) {
        this.availableSources.push(_);
      }
    });
  }

  selectedFields: any = {}
  selects = []
  addSelectedField(sf, srcAlias) {
    if(this.selectedFields[srcAlias]) {
      let fName = this.selectedFields[srcAlias].dbName;
      this.queryConfig.selects.push({
        entityFor: srcAlias,
        field: fName,
        alias: srcAlias + '_' + fName
      });
      this.selects.push({ s: sf.s, f: this.selectedFields[srcAlias]});
      delete this.selectedFields[srcAlias];
    }
  }
}

@Component({
  selector: 'add-sub-source-dialog',
  templateUrl: 'add-sub-source-dialog.html',
})
export class AddSubSourceDialog {
  selected: any;
  constructor(
    public dialogRef: MatDialogRef<AddSubSourceDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}
  onSaveClick(): void {
    this.dialogRef.close(this.selected);
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

interface JsonSqlModel {
  rootEntity: string;
  joins: JsonSqlJoin[];
  selects: JsonSqlSelect[];
  conditions: JsonSqlCondition[];
}
interface JsonSqlJoin {
  entityTo: string;
  alias: string;
  pkField: string;
  fkField: string;
}
interface JsonSqlSelect {
  entityFor: string;
  field: string;
  alias: string;
}
interface JsonSqlCondition{
  expressionOperation: string;
  conditionOperation: string;
  fieldAlias: string;
  paramName: string;
  paramValue: string;
}
