import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-supplier-certificates',
  templateUrl: './view-supplier-certificates.component.html',
  styleUrls: ['./view-supplier-certificates.component.scss']
})
export class ViewSupplierCertificatesComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  @Input() certificates: any[] = []
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
