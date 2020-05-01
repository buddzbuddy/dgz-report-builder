import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild,
  ViewContainerRef, ComponentFactoryResolver  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CamundaRestService } from '../camunda-rest.service';
import { GenericForm } from '../generic-form.component';

@Component({
  selector: 'app-start-process',
  templateUrl: './start-process.component.html',
  styleUrls: ['./start-process.component.scss']
})
export class StartProcessComponent implements OnInit {
  private processDefinitionKey: String = null;
  public formKey: String = null;
  private rootViewContainer = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private camundaRestService: CamundaRestService
              ) { }

  ngOnInit() {
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        this.processDefinitionKey = params['processdefinitionkey'];
        this.loadTaskKey();
      });
    }
  }

  loadTaskKey(): void {
    this.camundaRestService.getProcessDefinitionTaskKey(this.processDefinitionKey)
      .subscribe(formKey => {
        if(formKey.key == null) {
          this.camundaRestService.postProcessInstance(this.processDefinitionKey, { variables: { } }).subscribe();
          this.router.navigate(['/tasklist']);
        }
        else {
          this.formKey = formKey.key
        }
        //console.log(formKey);
      });
  }
}
