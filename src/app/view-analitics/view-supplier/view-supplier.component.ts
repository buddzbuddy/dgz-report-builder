import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private route: ActivatedRoute) { }
  @Input() supplier: any = { licenses: [], ip_items: [] }
  @Input() supplierId: number = 0;
  hasRoute = false
  ngOnInit() {
    if (this.supplierId > 0) {
      this.get_supplier_details(this.supplierId);
    }
    else if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['supplierId'] != null) {
          this.supplierId = params['supplierId'];
          this.get_supplier_details(this.supplierId);
          this.hasRoute = true;
        }
      });
    }
    this.getGlobalGrantedSources();
  }
  get_supplier_details(supplierId) {
    const href = 'data-api/supplier-requests/getDetails/' + supplierId;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.supplier = _;
      console.log(_);
      //this.getContractData();
    });
  }
  contractInfo: any = {}
  isLoadingResults: boolean = true;
  hasContractData: boolean = true;
  getContractData() {
    const href = '/api/tendering?&size=1000';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host_tendering + requestUrl).subscribe(_ => {
      //console.log(_);

      let c = null;
      for (let i = 0; i < _.releases.length; i++) {
        let r = _.releases[i];
        for (let j = 0; j < r.parties.length; j++) {
          let p = r.parties[j];
          if (p.identifier.id == this.supplier.inn && p.roles.indexOf('supplier') > -1) {
            c = r.contracts[0];
            this.contractInfo = c;
            console.log(c);
            break;
          }
        }
        if (c !== null) break;
      }
      this.isLoadingResults = false;
      this.hasContractData = c !== null;
    });
  }
  goBack() {
    window.history.back();
  }

  licenseChecked = false
  debtChecked = false
  getGlobalGrantedSources() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, { rootName: 'GrantedSource' }).subscribe(_ => {
      if (_['data'] != null) {
        let grantedSources: any[] = _['data'];
        for (let index = 0; index < grantedSources.length; index++) {
          const gSource = grantedSources[index];
          if (gSource.sourceType == 'LICENSE') {
            this.licenseChecked = true;
          }
          if (gSource.sourceType == 'DEBT') {
            this.debtChecked = true;
          }
        }
      }
      this.getLocalGrantedSources();
    })
  }
  getLocalGrantedSources() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: 'LocalGrantedSource',
      searchFitler: [
        {
          property: 'supplierId',
          operator: '=',
          value: this.supplierId
        }
      ]
    };
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      if (_['data'] != null) {
        let grantedSources: any[] = _['data'];
        for (let index = 0; index < grantedSources.length; index++) {
          const gSource = grantedSources[index];
          if (gSource.sourceType == 'LICENSE') {
            this.licenseChecked = false;
          }
          if (gSource.sourceType == 'DEBT') {
            this.debtChecked = false;
          }
        }
      }
    })
  }

}
