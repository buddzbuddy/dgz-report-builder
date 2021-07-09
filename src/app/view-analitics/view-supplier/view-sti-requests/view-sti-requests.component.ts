import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-sti-requests',
  templateUrl: './view-sti-requests.component.html',
  styleUrls: ['./view-sti-requests.component.scss']
})
export class ViewStiRequestsComponent implements OnInit {

  @Input() inn: string;
  constructor(private _httpClient: HttpClient,) { }
  stiRequests = []
  ngOnInit(): void {
    const href = 'data-api/supplier-requests/get-sti-requests/' + this.inn;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.stiRequests = _;
    });
  }

}
