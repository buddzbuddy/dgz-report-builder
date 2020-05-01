import { Component, OnInit,
  ViewChild, ViewContainerRef,
  ComponentFactoryResolver,
  OnChanges, SimpleChange, Input, ComponentRef } from '@angular/core';
import { TaskFormComponent } from './material/task-form/task-form.component';
import { SelectGridComponent } from './grid/select-grid.component';
import { DataService } from './data.service';
import { FieldConfig, CollectionItem } from './field.interface';
import { Validators } from '@angular/forms';
import { MultiSelectFormComponent } from './grid/multi-select-form/multi-select-form.component';

@Component({
  selector: 'generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: []
})
export class GenericForm implements OnChanges {
  @ViewChild('dynamic', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef

  @Input() formKey:string = null;// <-- <generic-form [formKey]="formKey"></generic-form>
  @Input() taskId:string = null;
  private rootViewContainer:ViewContainerRef = null;

  constructor(private factoryResolver: ComponentFactoryResolver,
    private odataSvc: DataService) {

  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      if (propName === 'formKey' && changes[propName].currentValue != null) {
        this.loadForm(changes[propName].currentValue);
      }
    }
  }

  loadForm(formKey: string): void {

    this.viewContainerRef.clear();

    this.setRootViewContainerRef(this.viewContainerRef);
    var formType = formKey.split(':')[0];
    if(formType == 'select-form') {
      this.createGridComponent(Number.parseInt(formKey.split(':')[1]));
    }
    else if (formType == 'multi-select-form') {
      this.createMultiSelectFormComponent(Number.parseInt(formKey.split(':')[1]));
    }
    else if (formType == 'form') {
      this.createFormComponent(Number.parseInt(formKey.split(':')[1]));
    }
  }

  public setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  public createFormComponent(templateId: number) {


    const factory = this.factoryResolver.resolveComponentFactory(TaskFormComponent)
    const component = factory.create(this.rootViewContainer.parentInjector)
    component.instance.taskId = this.taskId;
    component.instance.templateId = templateId;
    if(this.taskId != null) {
      component.instance.loadExistingVariables(this.taskId).then(_ => {
        let resourceItem = component.instance.data.resourceItem;
        this.odataSvc.getFieldsByTemplateId(templateId).subscribe((data) => {
          let formProperties = [];
            for (let f of data.value) {
              let formProperty = this.createFormProperty(f);
              if(resourceItem[f.Name]) {
                formProperty.value = resourceItem[f.Name];
              }
              formProperties.push(formProperty);
            }
            this.insertViewToContainer(component, formProperties);
          }
        );
      })
    }
    else {
      this.odataSvc.getFieldsByTemplateId(templateId).subscribe((data) => {
        let formProperties = [];
          for (let f of data.value) {
            formProperties.push(this.createFormProperty(f));
          }
          this.insertViewToContainer(component, formProperties);
        }
      );
    }
  }
  getCollections(resourceId: number): CollectionItem[] {
    let resourceItems: CollectionItem[] = [];
    this.odataSvc.getODataResource('CategoryResources').subscribe(_ => {
      resourceItems.push({ text: (_.Name || '-'), id: (_.id || 0) });
    });
    return resourceItems;
  }
  createFormProperty(resProperty: any) : FieldConfig {
    let formProperty: FieldConfig = {
      name: resProperty.Name,
      label: resProperty.Label,
      type: resProperty.ElementType
    };
    if(!resProperty.IsNullable) {
      formProperty.validations = [
        {
          name: 'required',
          validator: Validators.required,
          message: resProperty.Label + ' обязательно к заполнению'
        }
      ];
    }
    if(resProperty.ElementType == 'select') {
      formProperty.collections = this.getCollections(resProperty.DefaultValue || 0);
    }
    if(resProperty.InputType){
      formProperty.inputType = resProperty.InputType;
    }
    return formProperty;
  }
  insertViewToContainer(component: ComponentRef<TaskFormComponent>, formProperties: any[]){
    component.instance.resourceProperties = formProperties;
    this.rootViewContainer.insert(component.hostView);
  }

  public createGridComponent(templateId: number) {
    const factory = this.factoryResolver.resolveComponentFactory(SelectGridComponent)
    const component = factory.create(this.rootViewContainer.parentInjector)
    component.instance.taskId = this.taskId;
    component.instance.templateId = templateId;
    this.rootViewContainer.insert(component.hostView)
  }
  public createMultiSelectFormComponent(templateId: number) {
    const factory = this.factoryResolver.resolveComponentFactory(MultiSelectFormComponent)
    const component = factory.create(this.rootViewContainer.parentInjector)
    component.instance.taskId = this.taskId;
    component.instance.templateId = templateId;
    this.rootViewContainer.insert(component.hostView)
  }
}
