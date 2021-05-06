import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-privacy-settings',
  templateUrl: './view-privacy-settings.component.html',
  styleUrls: ['./view-privacy-settings.component.scss']
})
export class ViewPrivacySettingsComponent implements OnInit {

  constructor() { }
  isChecked1 = true;
  isChecked2 = true;
  isChecked3 = true;
  ngOnInit() {
  }

  goBack(){
    window.history.back();
  }
}
