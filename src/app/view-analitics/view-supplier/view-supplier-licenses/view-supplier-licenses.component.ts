import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-supplier-licenses',
  templateUrl: './view-supplier-licenses.component.html',
  styleUrls: ['./view-supplier-licenses.component.scss']
})
export class ViewSupplierLicensesComponent implements OnInit {

  constructor() { }
  @Input() licenses: any[] = []
  ngOnInit() {
  }

}
