import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-tender-details',
  templateUrl: './view-tender-details.component.html',
  styleUrls: ['./view-tender-details.component.scss']
})
export class ViewTenderDetailsComponent implements OnInit {
  @Input() release: any = null
  constructor() { }

  ngOnInit() {
  }

}
