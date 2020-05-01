import { Component  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamundaRestService } from '../camunda-rest.service';

@Component({
  selector: 'app-select-grid',
  templateUrl: './select-grid.component.html'
})
export class SelectGridComponent{
  taskId: String = null;
  templateId: number = 0;
  resourceName: String = null;
  constructor(
    private route: ActivatedRoute,
    private camundaRestService: CamundaRestService,
    private router: Router
  ){}
  onSelectResourceItem(selectedResourceItemId){
    this.route.params.subscribe(params => {
      var variables = this.generateVariableFromSelectedItem(selectedResourceItemId);
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
  generateVariableFromSelectedItem(selectedResourceItemId) {
    const variables = {
      variables: { }
    };
    variables.variables['selectedResourceItemId'] = {
      value: selectedResourceItemId
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
