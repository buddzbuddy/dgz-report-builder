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
    datasourceId: number
  ngOnInit() {
    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['datasourceId'] != null) {
          this.datasourceId = params['datasourceId'];
          this.getSourceDetails();
        }
      });
    }
  }

  fields = []
  offline_fields = []
  selected_fields = []

  getSourceFields(){
    const href = `data-api/datasources/${this.datasourceId}/fields/`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.fields = _;
    });
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.offline_fields = _;
    });
  }
  sourceObj:any = {}
  getSourceDetails(){
    const href = `data-api/datasources/${this.datasourceId}`;
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
  conditions = {}
  updateConditions(c:any){
    console.log('conditions updated', c);
    this.conditions = c;
  }
  data = []
  fetchData() {
    const href = `data-api/query/execute`;
    const requestUrl = `${href}`;
    let paramList = []
    for (let i = 0; i < Object.keys(this.conditions).length; i++) {
      const el = Object.keys(this.conditions)[i];
      paramList.push({
        key: el,
        operation: ":",
        value: this.conditions[el]
      })
    }
    let obj = {
      table: this.sourceObj.name,
      params: paramList
    }
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if(_.result) {
        this.data = _.data;
        //this.emitEventToChild();
      }
    });
  }
  eventsSubject: Subject<void> = new Subject<void>();

emitEventToChild() {
  this.eventsSubject.next();
}
}
