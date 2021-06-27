import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable, Subscription, timer } from "rxjs";
import { NotificationService } from "src/app/notification.service";
import { ServerResponseCode } from "../scheduler/response.code.constants";
import { SchedulerService } from "../scheduler/scheduler.service";

@Component({
  selector: 'app-view-scheduler',
  templateUrl: './view-scheduler.component.html',
  styleUrls: ['./view-scheduler.component.scss']
})
export class ViewSchedulerComponent implements OnInit, OnDestroy {
  schedulerForm: FormGroup;
  jobNameStatus: String;
  jobRecords = [];
  jobRefreshTimerSubscription: Subscription;

  isEditMode: boolean = false;

  constructor(private _router: Router,
    private _fb: FormBuilder,
    private _schedulerService: SchedulerService,
    private _responseCode: ServerResponseCode,
    private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.jobNameStatus = "";

    this.schedulerForm = this._fb.group({
      jobName: [''],
      year: [''],
      month: [''],
      day: [''],
      hour: [''],
      minute: [''],
      cronExpression: ['']//0 0/1 * 1/1 * ? *
    });
    this.setDate();
    this.getJobs();

    let t = timer(2000, 3000);
    this.jobRefreshTimerSubscription = t.subscribe(t => {
      this.getJobs();
    });
  }

  goBack() {
    window.history.back();
  }
  ngOnDestroy() {
    this.jobRefreshTimerSubscription.unsubscribe();
  }

  setDate(): void {
    let date = new Date();
    this.schedulerForm.patchValue({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes()
    });
  }

  resetForm() {
    var dateNow = new Date();
    this.schedulerForm.patchValue({
      jobName: "",
      year: dateNow.getFullYear(),
      month: dateNow.getMonth() + 1,
      day: dateNow.getDate(),
      hour: dateNow.getHours(),
      minute: dateNow.getMinutes()
    });
    this.jobNameStatus = "";
  }

  getJobs() {
    this._schedulerService.getJobs().subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS) {
          this.jobRecords = success.data;
        } else {
          this.notificationSvc.warn("Some error while fetching jobs");
        }

        /*
        let dateToShow = new Date(success.scheduleTime);
        this.jobRecords.scheduleTime = this.getFormattedDate(dateToShow.getFullYear(),
          dateToShow.getMonth(),dateToShow.getHours(), dateToShow.getHours(),
          dateToShow.getMinutes());
        */
      },
      err => {
        this.notificationSvc.warn("Error while getting all jobs");
      });
  }

  getFormattedDate(year, month, day, hour, minute) {
    return year + "/" + month + "/" + day + " " + hour + ":" + minute;
  }

  checkJobExistWith(jobName) {
    var data = {
      "jobName": jobName
    }
    this._schedulerService.isJobWithNamePresent(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS) {
          if (success.data == true) {
            this.jobNameStatus = "Bad :(";
          } else {
            this.jobNameStatus = "Good :)";
          }
        } else if (success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT) {
          this.notificationSvc.warn("Job name is mandatory.");
          this.schedulerForm.patchValue({
            jobName: "",
          });
        }
      },
      err => {
        this.notificationSvc.warn("Error while checkinh job with name exist.");
      });
    this.jobNameStatus = "";
  }

  scheduleJob() {
    var jobName = this.schedulerForm.value.jobName;
    var year = this.schedulerForm.value.year;
    var month = this.schedulerForm.value.month;
    var day = this.schedulerForm.value.day;
    var hour = this.schedulerForm.value.hour;
    var minute = this.schedulerForm.value.minute;

    var data = {
      "jobName": this.schedulerForm.value.jobName,
      "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
      "cronExpression": this.schedulerForm.value.cronExpression,
    }

    this._schedulerService.scheduleJob(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS) {
          this.notificationSvc.success("Задача успешно создана");
          this.resetForm();

        } else if (success.statusCode == ServerResponseCode.JOB_WITH_SAME_NAME_EXIST) {
          this.notificationSvc.warn("Эта задача уже запланирована");

        } else if (success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT) {
          this.notificationSvc.warn("Наиманование задачи не указана");
        }
        this.jobRecords = success.data;
      },
      err => {
        this.notificationSvc.warn("Error while getting all jobs");
      });
  }

  updateJob() {
    var jobName = this.schedulerForm.value.jobName;
    var year = this.schedulerForm.value.year;
    var month = this.schedulerForm.value.month;
    var day = this.schedulerForm.value.day;
    var hour = this.schedulerForm.value.hour;
    var minute = this.schedulerForm.value.minute;

    var data = {
      "jobName": this.schedulerForm.value.jobName,
      "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
      "cronExpression": this.schedulerForm.value.cronExpression
    }

    this._schedulerService.updateJob(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS) {
          this.notificationSvc.success("Задача успешно обновлена.");
          this.resetForm();

        } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
          this.notificationSvc.warn("Данная задача уже не существует");

        } else if (success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT) {
          this.notificationSvc.warn("Please provide job name.");
        }
        this.jobRecords = success.data;
      },
      err => {
        this.notificationSvc.warn("Неизвестная ошибка при обновлении");
      });
  }

  editJob(selectedJobRow) {
    this.isEditMode = true;

    var d = Date.parse(selectedJobRow.scheduleTime);
    let date = new Date(selectedJobRow.scheduleTime);
    this.schedulerForm.patchValue({
      jobName: selectedJobRow.jobName,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes()
    });
  }

  cancelEdit() {
    this.resetForm();
    this.isEditMode = false;
  }

  pauseJob(jobName) {
    var data = {
      "jobName": jobName
    }
    this._schedulerService.pauseJob(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
          this.notificationSvc.success("Задача успешно приостановлена")

        } else if (success.data == false) {
          if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
            this.notificationSvc.warn("Задача уже запущена/завершена, поэтому ПАУЗА недопустима (пауза действует для запланированных задач)");
          }
        }
        this.getJobs();
      },
      err => {
        this.notificationSvc.warn("Ошибка при ПАУЗЕ задачи");
      });

    //For updating fresh status of all jobs
    this.getJobs();
  }

  resumeJob(jobName) {
    var data = {
      "jobName": jobName
    }
    this._schedulerService.resumeJob(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
          this.notificationSvc.success("Задача успешно продолжена")

        } else if (success.data == false) {
          if (success.statusCode == ServerResponseCode.JOB_NOT_IN_PAUSED_STATE) {
            this.notificationSvc.warn("Job is not in paused state, so cannot be resumed.");
          }
        }

        //For updating fresh status of all jobs
        this.getJobs();
      },
      err => {
        this.notificationSvc.warn("Error while resuming job");
      });

    //For updating fresh status of all jobs
    this.getJobs();
  }

  stopJob(jobName) {
    var data = {
      "jobName": jobName
    }
    this._schedulerService.stopJob(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
          this.notificationSvc.success("Задача остановлена успешно")

        } else if (success.data == false) {
          if (success.statusCode == ServerResponseCode.JOB_NOT_IN_RUNNING_STATE) {
            this.notificationSvc.warn("Job not started, so cannot be stopped.");

          } else if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
            this.notificationSvc.warn("Job already started.");

          } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
            this.notificationSvc.warn("Job no longer exist.");
          }
        }

        //For updating fresh status of all jobs
        this.getJobs();
      },
      err => {
        this.notificationSvc.warn("Error while pausing job");
      });
  }

  startJobNow(jobName) {
    var data = {
      "jobName": jobName
    }
    this._schedulerService.startJobNow(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
          this.notificationSvc.success("Задача успешно запущена.")

        } else if (success.data == false) {
          if (success.statusCode == ServerResponseCode.ERROR) {
            this.notificationSvc.warn("Server error while starting job.");

          } else if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
            this.notificationSvc.warn("Job is already started.");

          } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
            this.notificationSvc.warn("Job no longer exist.");
          }
        }

        //For updating fresh status of all jobs
        this.getJobs();
      },
      err => {
        this.notificationSvc.warn("Error while starting job now.");
      });

    //For updating fresh status of all jobs
    this.getJobs();
  }

  deleteJob(jobName) {
    var data = {
      "jobName": jobName
    }
    this._schedulerService.deleteJob(data).subscribe(
      success => {
        if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
          this.notificationSvc.success("Задача успешно удалена");

        } else if (success.data == false) {
          if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
            this.notificationSvc.warn("Job is already started/completed, so cannot be deleted.");

          } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
            this.notificationSvc.warn("Job no longer exist.");
          }
        }

        //For updating fresh status of all jobs
        this.getJobs();
      },
      err => {
        this.notificationSvc.warn("Error while deleting job");
      });
  }

  refreshJob() {
    //For updating fresh status of all jobs
    this.getJobs();
  }

  cronChange(cronExp) {
    this.schedulerForm.patchValue({
      cronExpression: cronExp
    });
  }
  jobNameChange(name) {
    this.schedulerForm.patchValue({
      jobName: name
    });
  }

  getJobCaption(jobState: string): string {
    let jobCaption = jobState;
    if (jobState == 'RUNNING') {
      jobCaption = 'ВЫПОЛНЯЕТСЯ';
    }
    else if (jobState == 'PAUSED') {
      jobCaption = 'ПРИОСТАНОВЛЕН';
    }
    else if (jobState == 'BLOCKED') {
      jobCaption = 'ЗАБЛОКИРОВАН';
    }
    else if (jobState == 'COMPLETE') {
      jobCaption = 'ЗАВЕРШЕН';
    }
    else if (jobState == 'ERROR') {
      jobCaption = 'ОШИБКА';
    }
    else if (jobState == 'NONE') {
      jobCaption = 'ПУСТО';
    }
    else if (jobState == 'SCHEDULED') {
      jobCaption = 'ЗАПЛАНИРОВАН';
    }

    return jobCaption;
  }
}
