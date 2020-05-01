import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
  selector: "app-button",
  template: `
        <div class="text-right" [formGroup]="group">
          <button mat-raised-button color="primary" type="submit" [disabled]="group.invalid">Сохранить</button>
          <button mat-raised-button color="secondary" type="button">Отмена</button>
        </div>
`,
  styles: []
})
export class ButtonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {

  }
}
