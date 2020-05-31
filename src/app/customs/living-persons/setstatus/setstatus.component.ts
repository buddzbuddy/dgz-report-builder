import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-setstatus',
  templateUrl: './setstatus.component.html',
  styleUrls: ['./setstatus.component.scss']
})
export class SetstatusComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
    private dataSvc: DataService,
    private router: Router) { }
appId: number = 0
  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      reason: '',
    });
    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['appId'] != null) {
          this.appId = params['appId'];

        }
      });
    }
  }
  accept() {
    this.dataSvc.customApi_acceptApp(this.appId).subscribe(_ => {
      this.router.navigate(['/unemployeeApplications/view/' + this.appId]);
    })
  }
  reject() {
    this.dataSvc.customApi_rejectApp(this.appId, this.formGroup.value.reason).subscribe(_ => {
      this.router.navigate(['/unemployeeApplications/view/' + this.appId]);
    })
  }
}
