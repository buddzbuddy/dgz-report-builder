import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-report-uploader',
  templateUrl: './view-report-uploader.component.html',
  styleUrls: ['./view-report-uploader.component.scss']
})
export class ViewReportUploaderComponent implements OnInit {

  @Input() entityName;
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
    this.message = '';
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.http.post(AppConfig.settings.host + 'data-api/query/'+this.entityName+'/upload/excel', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Успешно загружен.';
          this.onUploadFinished.emit(event.body);
          files = []
        }
      });
  }
}
