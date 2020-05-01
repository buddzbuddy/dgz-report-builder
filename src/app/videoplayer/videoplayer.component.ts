import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html'
})
export class VideoplayerComponent implements OnInit {

  constructor() { }
  @Input('max-width') max_width: string
  @Input() src: string
  ngOnInit() {
  }

}
