import { formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
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
  constructor(public dialog: MatDialog, @Inject(LOCALE_ID) private locale: string) { }
  field_vals = []
  ngOnInit(){
    /*this._fields.subscribe(x => {
      this.loadSelectItems(x);
   })*/
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
        this.field_vals.push({
          property: _.field_name,
          operator: _.operation != null ? _.operation : '=',
          value: _.field_val
        });
    this.updateListEvent.emit(this.field_vals);
      }
      else {
        //console.log('filter not set')
      }
      //this.getWidget();
    });
  }

  hasAnyVals(fname: string) : boolean {
    let res = false;

    for (let index = 0; index < this.field_vals.length; index++) {
      const fObj = this.field_vals[index];
      if(fObj.property == fname) {
        res = true;
        break;
      }
    }

    return res;
  }

  getFieldValsFromList(fname: string) : any[] {
    let res = [];
    for (let index = 0; index < this.field_vals.length; index++) {
      const fObj = this.field_vals[index];
      if(fObj.property == fname) {
        if(this.isDate(fObj.property)) {
          res.push(fObj.operator + ' ' + formatDate(fObj.value, 'dd.MM.yyyy', this.locale));
        }
        else {
          res.push(fObj.operator + ' ' + fObj.value);
        }
      }
    }
    return res;
  }

  isDate(fname: string):boolean {

    for (let index = 0; index < this.fields.length; index++) {
      const f = this.fields[index];
      if(f.name == fname && f.dataType == 'Date') {
        return true;
      }
    }

    return false;
  }

  removeCondition(field_name) {
    delete this.field_vals[field_name];
    this.updateListEvent.emit(this.field_vals);
  }
  @Output() updateListEvent = new EventEmitter<any[]>();
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
        operation: '>'
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

export const ELEMENTS = {
  long: AddSelectConditionDialog,
  String: AddTextConditionDialog,
  Date: AddDateConditionDialog,
  boolean: AddCheckboxConditionDialog
}