import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-constructor',
  templateUrl: './view-constructor.component.html',
  styleUrls: ['./view-constructor.component.scss']
})
export class ViewConstructorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private _httpClient: HttpClient, ) { }
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
      this.getSourceFields()
    });
  }

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
}
