import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-constructor',
  templateUrl: './view-constructor.component.html',
  styleUrls: ['./view-constructor.component.scss']
})
export class ViewConstructorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private dataSvc: DataService,
    public dialog: MatDialog,
    private router: Router,) { }

  ngOnInit() {
  }
  todo = [
    'Наименование Поставщика',
    'Форма собственности',
    'ИНН',
    'Телефон'
  ];

  done = [
    'Банк',
    'Код районного налогового органа',
    'Element 1',
    'Element 2',
    'Element 3'
  ];

  getSourceFields(sourceId){
    this.dataSvc.getFieldsByTemplateId(sourceId).subscribe(_ => {

    });
  }

  goBack(){
    window.history.back();
  }
  drop(event: CdkDragDrop<string[]>) {
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
}