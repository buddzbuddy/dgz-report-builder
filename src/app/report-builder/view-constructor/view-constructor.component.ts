import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';

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
  todo = [
    'Наименование Поставщика',
    'Форма собственности',
    'ИНН',
    'Телефон'
  ];

  fields = []
  offline_fields = []
  selected_fields = []

  done = [
    'Банк',
    'Код районного налогового органа',
    'Element 1',
    'Element 2',
    'Element 3'
  ];

  getSourceFields(){
    const href = `data-api/datasources/${this.datasourceId}/fields/`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.fields = _;
      console.log(_);
    });
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.offline_fields = _;
      console.log(_);
    });
  }
  sourceObj:any = {}
  getSourceDetails(){
    const href = `data-api/datasources/${this.datasourceId}`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.sourceObj = _;
      this.getSourceFields()
      console.log(_);
    });
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
  }

  moveToConditions() {

  }
}
