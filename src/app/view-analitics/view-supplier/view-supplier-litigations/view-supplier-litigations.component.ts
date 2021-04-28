import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-supplier-litigations',
  templateUrl: './view-supplier-litigations.component.html',
  styleUrls: ['./view-supplier-litigations.component.scss']
})
export class ViewSupplierLitigationsComponent {

  constructor() { }
  @Input() items = []

}
