import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, Output, EventEmitter }                              from '@angular/core';
import { Injectable }                                                          from '@angular/core';


@Injectable({
    providedIn: 'root'
  })
export class SchedulerService {

    getJobsUrl = "data-api/scheduler/jobs";
    scheduleJobUrl = "data-api/scheduler/schedule";
    pauseJobUrl = "data-api/scheduler/pause";
    resumeJobUrl = "data-api/scheduler/resume";
    deleteJobUrl = "data-api/scheduler/delete";
    updateJobUrl = "data-api/scheduler/update";
    isJobWithNamePresentUrl = "data-api/scheduler/checkJobName";
    stopJobUrl = "data-api/scheduler/stop";
    startJobNowUrl = "data-api/scheduler/start";

    constructor(
        private _http: HttpClient) {
    }

    getJobs(){
        return this._http.get<any>(this.getJobsUrl);
    }

    scheduleJob(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }

        return this._http.get<any>(this.scheduleJobUrl, {params});
    }

    isJobWithNamePresent(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }
        return this._http.get<any>(this.isJobWithNamePresentUrl, {params});
    }

    pauseJob(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }
        return this._http.get<any>(this.pauseJobUrl, {params});
    }

    resumeJob(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }
        return this._http.get<any>(this.resumeJobUrl, {params});
    }

    deleteJob(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }
        return this._http.get<any>(this.deleteJobUrl, {params});
    }

    stopJob(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }
        return this._http.get<any>(this.stopJobUrl, {params});
    }

    startJobNow(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }
        return this._http.get<any>(this.startJobNowUrl, {params});
    }

    updateJob(data){
        let params = new HttpParams();
        for(let key in data) {
            params = params.append(key, data[key]);
        }
        return this._http.get<any>(this.updateJobUrl, {params});
    }
}
