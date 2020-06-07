import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { FieldConfig } from "../../field.interface";

@Component({
  exportAs: "dynamicForm",
  selector: "dynamic-form",
  template: `
  <form class="normal-form" [formGroup]="form">
  <div class="controles-container">
  <ng-container *ngFor="let field of fields;" dynamicField [field]="field" [group]="form">
  </ng-container>
  <div style="text-align:right;" [formGroup]="form">
          <button mat-raised-button color="primary" class="col-md-2" type="submit" [disabled]="form.invalid">Сохранить</button>
          <button mat-raised-button color="secondary" class="col-md-2" type="button" (click)="onClose()">Отмена</button>
        </div>
  </div>
  </form>
  `,
  styles: []
})
export class DynamicFormComponent implements OnInit {
  @Input()
  fields: FieldConfig[] = [];

  @Output()
  change: EventEmitter<any> = new EventEmitter<any>();

  @Output('cancelBtnClick')
  cancelBtnClick: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  resourceName: string;
  get value() {
    return this.form.value;
  }
  constructor(
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.form = this.createControl();
  }

  onClear(){
    //TODO: Reset form values
  }
  onClose(){
    this.cancelBtnClick.emit();
  }
  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === "button") return;
      const control = this.fb.control(
        field.value,
        this.bindValidations(field.validations || [])
      );
      control.valueChanges.subscribe(value => {
        //console.log('change event for: ' + field.name + '=' + value);
        this.change.emit(value);
      });
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}
