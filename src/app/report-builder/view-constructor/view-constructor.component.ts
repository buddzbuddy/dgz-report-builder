import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-view-constructor',
  templateUrl: './view-constructor.component.html',
  styleUrls: ['./view-constructor.component.scss']
})
export class ViewConstructorComponent implements OnInit {

  constructor() { }

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
