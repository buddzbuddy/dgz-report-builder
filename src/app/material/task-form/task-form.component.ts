import { Component, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamundaRestService } from '../../camunda-rest.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/field.interface';
import { DataService } from 'src/app/data.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  styleUrls: ['./task-form.component.scss'],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  @ViewChild(DynamicFormComponent, { static: true }) form: DynamicFormComponent;

  resourceProperties: FieldConfig[] = [

  ];
  taskId: string = null;
  resourceName: string = null;
  templateId: number = 0;
  data: any = {resourceItem: {}};
  actionTypeNames: string[];
  constructor(
    private route: ActivatedRoute,
    private camundaRestService: CamundaRestService,
    private router: Router,
    private localStorageSvc: LocalStorageService,
    private odataSvc: DataService
  ) {

   }
  ngOnInit(){
    this.odataSvc.getTemplateById(this.templateId).subscribe((tmplData) => {
      this.resourceName = tmplData.Name;
    });
  }
  onSubmit(value: any, actionType: string) {
    if (this.form.form.valid) {
      let resourceItem = value;
      this.data = { resourceItem };
      this.route.params.subscribe(params => {
        this.data['resourceName'] = this.resourceName;
        this.data['resourceId'] = this.templateId;
        this.data['ActionType'] = actionType;
        const variables = this.generateVariablesFromFormFields();

        if(params['processdefinitionkey']){
          //StartProcessFormComponent
          const processDefinitionKey = params['processdefinitionkey'];
          this.camundaRestService.postProcessInstance(processDefinitionKey, variables).subscribe();
        }
        else if (this.taskId != null) {
          //CompleteTaskFormComponent
          this.camundaRestService.postCompleteTask(this.taskId, variables).subscribe((res) => this.localStorageSvc.remove(this.taskId) );
        }
        this.router.navigate(['/tasklist']);
      });
    } else {
      this.form.validateAllFormFields(this.form.form);
    }
  }
  onChange(value: any) {
    this.savedLocally = false;
  }

  savedLocally: boolean = true;
  saveLocally() {
    //Save locally first
    let localStorageData = {
      resourceItem: this.form.value,
      ActionTypes: this.data.ActionTypes
    };
    this.localStorageSvc.save(this.taskId, localStorageData);
    this.savedLocally = true;
  }

  generateVariablesFromFormFields() {
    const variables = {
      variables: { }
    };
    Object.keys(this.data).forEach((field) => {
      variables.variables[field] = {
        value: this.data[field]
      };
    });

    return variables;
  }
  loadExistingVariables(taskId: string) {
    let promise = new Promise((resolve, reject) => {
      if(this.localStorageSvc.has(taskId)) {
        let localStorageData = this.localStorageSvc.get(taskId);
        this.data.resourceItem = localStorageData.resourceItem;
        this.actionTypeNames = Object.keys(localStorageData.ActionTypes);
        this.data.ActionTypes = localStorageData.ActionTypes;
        this.savedLocally = true;
        resolve();
      }
      else {
        this.camundaRestService.getAllVariablesForTask(taskId)
        .toPromise()
        .then(
          result => { // Success

          resolve();
          this.generateModelFromVariables(result);
          //console.log('promise-result ', result);
          },
          msg => { // Error
          reject(msg);
          }
        );
      }
    });
    return promise;
  }
  generateModelFromVariables(variables) {
    Object.keys(variables).forEach((variableName) => {
      this.data[variableName] = variables[variableName].value;

      if(variableName == 'ActionTypes') {
        this.actionTypeNames = Object.keys(this.data[variableName]);
      }
    });
  }
}
