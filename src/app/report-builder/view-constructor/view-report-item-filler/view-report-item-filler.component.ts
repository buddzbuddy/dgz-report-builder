import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { ELEMENTS } from '../view-report-conditions/view-report-conditions.component';

@Component({
  selector: 'app-view-report-item-filler',
  templateUrl: './view-report-item-filler.component.html',
  styleUrls: ['./view-report-item-filler.component.scss']
})
export class ViewReportItemFillerComponent implements OnInit {
  private _fields = new BehaviorSubject<any>({});
  @Input() set fields(value: any) { 
    this._fields.next(value); 
}
get fields() {
  return this._fields.getValue();
}
  constructor(public dialog: MatDialog,private _httpClient: HttpClient, ) { }
  field_vals = {}
  entityName = ''
  ngOnInit(){
    this._fields.subscribe(x => {
      //this.loadSelectItems(x.fields);
      this.entityName = x.entityName
   })
  }
  @Input() selectItems = {}
  addCondition(f) {
    //console.log(this.selectItems[f.name])
    var d = {
      field_name: f.name,
      field_label: f.label
    };
    if (f.dataType == 'long' && f.dictionaryFieldName != null) {
      d['items'] = this.selectItems[f.name];
      d['item_field_name'] = f.dictionaryFieldName
    }
    const dialogRef = this.dialog.open(ELEMENTS[f.dataType], {
      data: d
    });
    dialogRef.afterClosed().subscribe(_ => {
      if(_ != null) {
        console.log('filter set')
        this.field_vals[_.field_name] = _.field_val
    //this.updateListEvent.emit(this.field_vals);
      }
      else {
        //console.log('filter not set')
      }
      //this.getWidget();
    });
  }

  removeCondition(field_name) {
    delete this.field_vals[field_name];
    //this.updateListEvent.emit(this.field_vals);
  }

  saveEntry(){
    const href = `data-api/query/insert`;
const requestUrl = `${href}`;
let fObj = []
    for (let fName of Object.keys(this.field_vals)) {
      fObj.push({
        name: fName,
        val: this.field_vals[fName]
      })
    }
    let obj = {
      entityName: this.entityName,
      fields: fObj
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if(_) {
        console.log(_);
        //this.selectItems[f.name] = _.data;
      }
    });
  }

  @Output() updateListEvent = new EventEmitter<any>();
}
