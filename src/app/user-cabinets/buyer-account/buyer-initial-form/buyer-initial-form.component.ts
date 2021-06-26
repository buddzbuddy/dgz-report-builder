import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-buyer-initial-form',
  templateUrl: './buyer-initial-form.component.html',
  styleUrls: ['./buyer-initial-form.component.scss']
})
export class BuyerInitialFormComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder, private _httpClient: HttpClient, private notificationSvc: NotificationService) { }

  @Input() buyer = null;
  @Input() edit = null;
  formGroup: FormGroup;
  ngOnInit(): void {


    this.formGroup = this._formBuilder.group({
      factAddress: ['', [Validators.required]],
      legalAddress: ['', Validators.required],
      telephone: ['', Validators.required],
    });

    if (this.edit != null) {
      this.formGroup.patchValue(this.edit);
    }
  }

  save() {
    const href = 'data-api/supplier-requests/saveInitialBuyer';
    const requestUrl = `${href}`;
    let obj = {
      ...this.formGroup.value,
      buyerId: this.buyer.id
    }
    this._httpClient.post<boolean>(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      console.log(_);
      if (_) {
        this.notificationSvc.success('Анкета успешно сохранена!');
        window.location.reload();
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так!');
      }
    });
  }
}
