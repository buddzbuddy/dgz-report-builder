import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-view-supplier-uploads',
  templateUrl: './view-supplier-uploads.component.html',
  styleUrls: ['./view-supplier-uploads.component.scss']
})
export class ViewSupplierUploadsComponent implements OnInit {

  @Input() supplierid: number = 0;
  public progress: number;
  public message: string;
  constructor(private _httpClient: HttpClient, private notificationSvc: NotificationService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.getList();
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['supplierId'] != null) {
          this.isCabinet = false;
        }
      });
    }
  }
  isCabinet = true;
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.message = '';
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this._httpClient.post(AppConfig.settings.host + 'data-api/files/' + this.supplierid + '/upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Успешно загружен.';
          //this.onUploadFinished.emit(event.body);
          files = []
          this.getList();
        }
      });
  }
  files = []
  getList() {
    const href = `data-api/files/${this.supplierid}/list`;
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.files = _;
    });
  }

  getFileName(n: string): string {
    let s = n.split('-');
    let n2 = '';
    if (s.length >= 2) {
      s.shift();
      n2 = s.join();
    }
    return n2;
  }

  remove(f) {
    if (confirm('Вы уверены что хотите удалить файл?')) {
      const href = `data-api/files/${this.supplierid}/delete/${f.name}`;
      const requestUrl = `${href}`;
      this._httpClient.delete<boolean>(AppConfig.settings.host + requestUrl).subscribe(_ => {
        if (_) {
          this.notificationSvc.success('Файл успешно удален!');
          this.getList();
        }
        else {
          this.notificationSvc.warn('Что-то пошло не так!');
        }
      });
    }
  }
}
