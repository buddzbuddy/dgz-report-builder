import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-supplier-debts',
  templateUrl: './view-supplier-debts.component.html',
  styleUrls: ['./view-supplier-debts.component.scss']
})
export class ViewSupplierDebtsComponent {

  constructor() { }
  @Input() items = []
}
