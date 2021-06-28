import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-supplier-initial-form',
  templateUrl: './supplier-initial-form.component.html',
  styleUrls: ['./supplier-initial-form.component.scss']
})
export class SupplierInitialFormComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder, private _httpClient: HttpClient, private notificationSvc: NotificationService) { }

  @Input() supplier = null;
  @Input() edit = null;
  formGroup: FormGroup;
  ngOnInit(): void {


    this.formGroup = this._formBuilder.group({
      factAddress: ['', [Validators.required]],
      legalAddress: ['', Validators.required],
      ownershipTypeId: ['', Validators.required],
      industryId: ['', Validators.required],
      telephone: ['', Validators.required],
      bankName: ['', Validators.required],
      bankAccount: ['', Validators.required],
      bic: ['', Validators.required],
      resident: [true, Validators.required],
      /*managerPin: ['', Validators.required],
      managerLastname: ['', Validators.required],
      managerFirstname: ['', Validators.required],
      managerMiddlename: ['', Validators.required],*/
    });

    if (this.edit != null) {
      this.formGroup.patchValue(this.edit);
    }
    else {
      this.formGroup.addControl('managerPin', this._formBuilder.control(null));
      this.formGroup.addControl('managerLastname', this._formBuilder.control(null));
      this.formGroup.addControl('managerFirstname', this._formBuilder.control(null));
      this.formGroup.addControl('managerMiddlename', this._formBuilder.control(null));
    }

    this.getOwnershipTypes();
    this.getIndustries();
  }

  save() {
    const href = 'data-api/supplier-requests/saveInitialSupplier';
    const requestUrl = `${href}`;
    let obj = {
      ...this.formGroup.value,
      supplierId: this.supplier.id
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

  ownershipTypes: any[] = [];
  getOwnershipTypes() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: "OwnershipType"
    }
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.ownershipTypes = _['data'];
    });
  }

  industries: any[] = [];
  getIndustries() {
    let obj = {
      rootName: "Industry"
    }
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.industries = _['data'];
    });
  }
}
