import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-supplier-crimes',
  templateUrl: './view-supplier-crimes.component.html',
  styleUrls: ['./view-supplier-crimes.component.scss']
})
export class ViewSupplierCrimesComponent {

  constructor() { }
  @Input() items = []

}
