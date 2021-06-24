import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-supplier-deals',
  templateUrl: './view-supplier-deals.component.html',
  styleUrls: ['./view-supplier-deals.component.scss']
})
export class ViewSupplierDealsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  @Input() deals: any[] = []
  ngOnInit() {
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['supplierId'] != null) {
          this.isCabinet = false;
        }
      });
    }
  }


  isCabinet = true;
  @Output() removeEvent = new EventEmitter<number>();
  remove(id: number) {
    this.removeEvent.emit(id);
  }
}
