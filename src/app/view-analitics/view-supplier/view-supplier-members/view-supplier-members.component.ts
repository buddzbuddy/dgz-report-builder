import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'view-supplier-members',
  templateUrl: './view-supplier-members.component.html',
  styleUrls: ['./view-supplier-members.component.scss']
})
export class ViewSupplierMembersComponent implements OnInit {

  constructor(private _httpClient: HttpClient) { }

  @Input() supplierId: number = 0;
  ngOnInit() {
    this.get_supplier_members();
  }

  supplier_members: any[] = [];
  getDirectorName() : string {
    let managerName = '-';
    if(this.supplier_members.length){
      for (let index = 0; index < this.supplier_members.length; index++) {
        const m = this.supplier_members[index];
        if(m.memberTypeId == 1) {
          managerName = m.surname + ' ' + m.name + ' ' + (m.patronymic || '');
        }
      }
    }
    return managerName;
  }
  get_supplier_members(){
    const href = '/api/AnalisingServices/GetSupplierMembers?supplierId=' + this.supplierId;
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.supplier_members = _;
    });
  }

}
