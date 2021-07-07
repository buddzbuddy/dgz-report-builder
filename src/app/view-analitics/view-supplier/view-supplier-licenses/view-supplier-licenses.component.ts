import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-supplier-licenses',
  templateUrl: './view-supplier-licenses.component.html',
  styleUrls: ['./view-supplier-licenses.component.scss']
})
export class ViewSupplierLicensesComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  @Input() licenses: any[] = []
  @Input() supplierId: number = 0
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
