import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-view-supplier-uploads',
  templateUrl: './view-supplier-uploads.component.html',
  styleUrls: ['./view-supplier-uploads.component.scss']
})
export class ViewSupplierUploadsComponent implements OnInit, OnDestroy {

  @Input() supplierid: number = 0;
  @Input() packageTypeName: string;
  @Input() packageItemId: number = 0;
  @Input() withPreload: boolean = false;
  private eventsSubscription: Subscription;

  @Input() fireToUpload: Observable<number>;
  @ViewChild('file', { static: false }) file: ElementRef;
  @Output() public onFileSelected = new EventEmitter();
  @Output() public onUploadFinished = new EventEmitter();
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
    if (this.fireToUpload != null) {
      this.eventsSubscription = this.fireToUpload.subscribe((packageItemId) => this.uploadNow(packageItemId));
    }
  }
  ngOnDestroy() {
    if (this.eventsSubscription != null)
      this.eventsSubscription.unsubscribe();
  }
  setPreloaded() {
    let files = this.file.nativeElement.files;
    if (files.length > 0) {
      this.onFileSelected.emit();
    }
  }
  uploadNow(packageItemId) {
    this.packageItemId = packageItemId;
    this.uploadFile();
  }
  isCabinet = true;
  public uploadFile = () => {
    let files = this.file.nativeElement.files;
    if (files.length === 0) {
      return;
    }
    this.message = '';
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this._httpClient.post(AppConfig.settings.host + `data-api/files/${this.supplierid}/${this.packageTypeName}/${this.packageItemId}/upload`, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          //this.message = 'Успешно загружен.';
          if (!this.withPreload) {
            this.notificationSvc.success('Файл успешно загружен!');
            files = []
            this.getList();
          }
          else {
            this.onUploadFinished.emit();
          }
        }
      });
  }
  files = []
  getList() {
    const href = `data-api/files/${this.supplierid}/${this.packageTypeName}/${this.packageItemId}/list`;
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
    return n2.substr(0, 10);
  }

  remove(f) {
    if (confirm('Вы уверены что хотите удалить файл?')) {
      const href = `data-api/files/${this.supplierid}/${this.packageTypeName}/${this.packageItemId}/delete/${f.name}`;
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
