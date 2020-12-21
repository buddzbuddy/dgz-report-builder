import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-upload-supplier-list',
  templateUrl: './upload-supplier-list.component.html',
  styleUrls: ['./upload-supplier-list.component.scss']
})
export class UploadSupplierListComponent implements OnInit {

  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient) { }
  ngOnInit() {
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.http.post(AppConfig.settings.host + '/api/AnalisingServices/Upload', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Успешно загружен.';
          this.onUploadFinished.emit(event.body);
        }
      });
  }
}
