import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-supplier-ips',
  templateUrl: './view-supplier-ips.component.html',
  styleUrls: ['./view-supplier-ips.component.scss']
})
export class ViewSupplierIpsComponent implements OnInit {

  constructor() { }
  @Input() items: any[] = []
  ngOnInit() {
  }

}
