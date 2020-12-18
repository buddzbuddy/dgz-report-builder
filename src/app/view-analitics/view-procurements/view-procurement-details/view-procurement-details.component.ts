import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-procurement-details',
  templateUrl: './view-procurement-details.component.html',
  styleUrls: ['./view-procurement-details.component.scss']
})
export class ViewProcurementDetailsComponent implements OnInit {

  @Input() release: any = null
  constructor() { }

  ngOnInit() {
  }

}
