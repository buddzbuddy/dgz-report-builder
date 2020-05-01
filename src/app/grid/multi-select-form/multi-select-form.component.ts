import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamundaRestService } from '../../camunda-rest.service';

@Component({
  selector: 'app-multi-select-form',
  templateUrl: './multi-select-form.component.html'
})
export class MultiSelectFormComponent {
  taskId: String = null;
  templateId: number = 0;
  resourceName: String = null;
  selectedResourceItemIds: number[] = [];
  constructor(
    private route: ActivatedRoute,
    private camundaRestService: CamundaRestService,
    private router: Router
  ){}
  onCheckResourceItem(checkedInfo) {
    if(checkedInfo.isChecked) {
      this.selectedResourceItemIds.push(checkedInfo.resourceItemId);
    }
    else {
      this.selectedResourceItemIds = this.selectedResourceItemIds.filter(r => r != checkedInfo.resourceItemId);
    }
  }
  onComplete() {
    this.route.params.subscribe(params => {
      var variables = this.generateVariableFromSelectedItem(this.selectedResourceItemIds);
      if(params['processdefinitionkey']){
        //StartProcessFormComponent
        const processDefinitionKey = params['processdefinitionkey'];
        this.camundaRestService.postProcessInstance(processDefinitionKey, variables).subscribe();
      }
      else if(this.taskId != null){
        //CompleteTaskFormComponent
        this.camundaRestService.postCompleteTask(this.taskId, variables).subscribe();
      }
      this.router.navigate(['/tasklist']);
    });
  }
  generateVariableFromSelectedItem(selectedResourceItemIds) {
    const variables = {
      variables: { }
    };
    variables.variables['selectedResourceItemIds'] = {
      value: selectedResourceItemIds
    };
    variables.variables['resourceName'] = {
      value: this.resourceName
    };
    variables.variables['resourceId'] = {
      value: this.templateId
    };
    return variables;
  }
}
