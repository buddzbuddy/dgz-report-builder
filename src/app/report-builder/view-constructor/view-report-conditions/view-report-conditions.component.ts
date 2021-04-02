import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-report-conditions',
  templateUrl: './view-report-conditions.component.html',
  styleUrls: ['./view-report-conditions.component.scss']
})
export class ViewReportConditionsComponent implements OnInit {
  private _fields = new BehaviorSubject<any[]>([]);
  @Input() set fields(value: any[]) { 
    this._fields.next(value); 
}
get fields() {
  return this._fields.getValue();
}
  constructor(public dialog: MatDialog,private _httpClient: HttpClient, ) { }
  field_vals = {}
  ngOnInit(){
    this._fields.subscribe(x => {
      this.loadSelectItems(x);
   })
  }
  selectItems = {}
  loadSelectItems(fields: any[]) {
    const href = `data-api/query/execute`;
const requestUrl = `${href}`;
    fields.forEach(f => {
      if(f.dataType == 'select' && f.dictionaryClassName != null) {
    let obj = {
      table: f.dictionaryClassName
    };
    this._httpClient.post<any>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if(_.result) {
        this.selectItems[f.name] = _.data;
      }
    });
      }
    });
  }
  addCondition(f) {
    var d = {
      field_name: f.name,
      field_label: f.label
    };
    if (f.dataType == 'select') {
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

@Component({
  selector: 'add-text-condition-dialog',
  templateUrl: 'add-text-condition-dialog.html',
})
export class AddTextConditionDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddTextConditionDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        field_val: '',
      });
    }
  onSaveClick(): void {
    this.dialogRef.close({ ...this.formGroup.value, field_name: this.data.field_name});
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-date-condition-dialog',
  templateUrl: 'add-date-condition-dialog.html',
})
export class AddDateConditionDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddDateConditionDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        field_val: '',
      });
    }
  onSaveClick(): void {
    this.dialogRef.close({ ...this.formGroup.value, field_name: this.data.field_name});
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-checkbox-condition-dialog',
  templateUrl: 'add-checkbox-condition-dialog.html',
})
export class AddCheckboxConditionDialog {
  isSelected: boolean;
  constructor(
    public dialogRef: MatDialogRef<AddCheckboxConditionDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}
  onSaveClick(): void {
    this.dialogRef.close({ field_val: this.isSelected, field_name: this.data.field_name});
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-select-condition-dialog',
  templateUrl: 'add-select-condition-dialog.html',
})
export class AddSelectConditionDialog {
  selected: number;
  constructor(
    public dialogRef: MatDialogRef<AddSelectConditionDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}
  onSaveClick(): void {
    this.dialogRef.close({ field_val: this.selected, field_name: this.data.field_name});
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

const ELEMENTS = {
  select: AddSelectConditionDialog,
  text: AddTextConditionDialog,
  date: AddDateConditionDialog,
  checkbox: AddCheckboxConditionDialog
}