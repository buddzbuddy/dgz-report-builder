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
  supplier: any = {}
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
    });
  }

}
