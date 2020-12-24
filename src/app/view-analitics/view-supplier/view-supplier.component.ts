import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private route: ActivatedRoute) { }
  supplier: any = {licenses:[],ip_items:[]}
  supplierId: number = 0;
  ngOnInit() {
    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['supplierId'] != null) {
          this.supplierId = params['supplierId'];
          this.get_supplier_details(this.supplierId);
        }
      });
    }
  }
  get_supplier_details(supplierId){
    const href = '/api/AnalisingServices/GetSupplierDetails?id=' + supplierId;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.supplier = _;
      console.log(_);
      this.getContractData();
    });
  }
  contractInfo: any = {}
  isLoadingResults: boolean = true;
  hasContractData: boolean = true;
  getContractData(){
    const href = '/api/tendering?&size=1000';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host_tendering + requestUrl).subscribe(_ => {
      //console.log(_);

      let c = null;
      for (let i = 0; i < _.releases.length; i++) {
        let r = _.releases[i];
        for (let j = 0; j < r.parties.length; j++) {
          let p = r.parties[j];
          if(p.identifier.id == this.supplier.inn && p.roles.indexOf('supplier') > -1) {
            c = r.contracts[0];
            this.contractInfo = c;
            console.log(c);
            break;
          }
        }
        if(c !== null) break;
      }
      this.isLoadingResults = false;
      this.hasContractData = c !== null;
    });
  }
  goBack(){
    window.history.back();
  }
}
