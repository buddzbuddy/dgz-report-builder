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
  }

  @Input() supplier_members: any[] = [];
  getDirectorName() : string {
    let managerName = '-';
    if(this.supplier_members){
      for (let index = 0; index < this.supplier_members.length; index++) {
        const m = this.supplier_members[index];
        if(m.memberType.name == 'Руководитель') {
          managerName = m.surname + ' ' + m.name + ' ' + (m.patronymic || '');
        }
      }
    }
    return managerName;
  }
}
