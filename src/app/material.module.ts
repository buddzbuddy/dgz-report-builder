import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Material from "@angular/material";
import { EntityformComponent } from './material/entity-form/entity-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { TaskFormComponent } from './material/task-form/task-form.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    EntityformComponent,
    TaskFormComponent,
    DynamicFormComponent,
    DynamicFieldDirective
  ],
  imports: [
    CommonModule,
    Material.MatTableModule,
    Material.MatProgressSpinnerModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    Material.MatRadioModule,
    Material.MatSelectModule,
    Material.MatCheckboxModule,
    Material.MatDatepickerModule,
    Material.MatNativeDateModule,
    Material.MatButtonModule,
    Material.MatSnackBarModule,
    Material.MatIconModule,
    Material.MatSortModule,
    Material.MatPaginatorModule,
    Material.MatDialogModule,
    Material.MatToolbarModule,
    Material.MatCardModule,
    Material.MatListModule,
    MatMomentDateModule,
    Material.MatOptionModule,
    Material.MatSidenavModule,
    Material.MatDividerModule,
    NgxMatSelectSearchModule,
    Material.MatTooltipModule,
    Material.MatChipsModule,
    Material.MatStepperModule,
    Material.MatExpansionModule,
    Material.MatAutocompleteModule,
    Material.MatButtonToggleModule,
    Material.MatSlideToggleModule
  ],
  exports: [
    Material.MatTableModule,
    Material.MatProgressSpinnerModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatRadioModule,
    Material.MatSelectModule,
    Material.MatCheckboxModule,
    Material.MatDatepickerModule,
    Material.MatNativeDateModule,
    Material.MatButtonModule,
    Material.MatSnackBarModule,
    Material.MatIconModule,
    Material.MatSortModule,
    Material.MatPaginatorModule,
    Material.MatDialogModule,
    Material.MatToolbarModule,
    Material.MatCardModule,
    Material.MatListModule,
    MatMomentDateModule,
    Material.MatOptionModule,
    Material.MatSidenavModule,
    Material.MatDividerModule,
    NgxMatSelectSearchModule,
    Material.MatTooltipModule,
    Material.MatChipsModule,
    Material.MatStepperModule,
    Material.MatExpansionModule,
    Material.MatAutocompleteModule,
    Material.MatButtonToggleModule,
    Material.MatSlideToggleModule
  ]
})
export class MaterialModule { }
