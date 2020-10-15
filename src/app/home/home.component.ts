
import * as moment from 'moment'
import { OAuthService } from 'angular-oauth2-oidc';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { AppConfig } from '../app.config';
import { DataService } from '../data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
  }

}
