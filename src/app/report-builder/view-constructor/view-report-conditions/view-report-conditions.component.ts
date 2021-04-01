import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewListTileDialog } from 'src/app/customs/flutter/list-view-widget/list-view-widget.component';

@Component({
  selector: 'app-view-report-conditions',
  templateUrl: './view-report-conditions.component.html',
  styleUrls: ['./view-report-conditions.component.scss']
})
export class ViewReportConditionsComponent implements OnInit {

  @Input() fields: any[] = []
  constructor(public dialog: MatDialog,) { }
  field_vals = {}
  ngOnInit() {
  }

  
  addCondition(field_name) {
    const dialogRef = this.dialog.open(NewListTileDialog, {
      data: {
        field_name: field_name
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      if(_ != null) {
        console.log('filter set')
        this.field_vals[_.field_name] = _.field_val
    this.updateListEvent.emit(this.field_vals);
      }
      else {
        console.log('filter not set')
      }
      //this.getWidget();
    });
  }

  removeCondition(field_name) {
    delete this.field_vals[field_name];
    this.updateListEvent.emit(this.field_vals);
  }
  @Output() updateListEvent = new EventEmitter<any>();
}
