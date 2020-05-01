import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CamundaRestService } from '../camunda-rest.service';
import { Task } from '../schemas/Task';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit {
  tasks: Task[] = null;
  taskId: String;
  formKey: String;

  constructor(
    private camundaRestService: CamundaRestService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getTasks();
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['id'] != null) {
          this.taskId = params['id'];
          this.getFormKey();
        } else {
          this.getTasks();
        }
      });
    }
  }

  getFormKey(): void {
    this.camundaRestService
      .getTaskFormKey(this.taskId)
      .subscribe(formKey => this.formKey = formKey.key);
  }

  getTasks(): void {
    this.camundaRestService
      .getTasks()
      .subscribe(tasks => {
        this.tasks = tasks;
        /*if(tasks.length > 0) {
          this.router.navigate(['/tasklist/' + tasks[0].id]);
        }*/
      });
  }

}
