import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-supplier-initial-form',
  templateUrl: './supplier-initial-form.component.html',
  styleUrls: ['./supplier-initial-form.component.scss']
})
export class SupplierInitialFormComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder, private _httpClient: HttpClient,) { }

  @Input() supplier = null;

  formGroup: FormGroup;
  ngOnInit(): void {


    this.formGroup = this._formBuilder.group({
      factAddress: ['', [Validators.required]],
      legalAddress: ['', Validators.required],
      ownershipTypeId: ['', Validators.required],
      industryId: ['', Validators.required],
      telephone: ['', Validators.required],
      bank_name: ['', Validators.required],
      bank_account: ['', Validators.required],
      bic: ['', Validators.required],
      is_resident: ['', Validators.required],
    });

    this.getOwnershipTypes();
    this.getIndustries();
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
