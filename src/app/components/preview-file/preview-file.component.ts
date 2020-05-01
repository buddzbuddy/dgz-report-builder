import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss']
})
export class PreviewFileComponent implements OnInit {
  @Input() id: string = ''
  @Input('max-width') max_width: string
  constructor(private dataSvc: DataService) { }
  public fileObj: any = {}
  public isImage: boolean = false;
  public isVideo: boolean = false;
  public url: string = ''
  ngOnInit() {
    this.dataSvc.getFile(this.id).subscribe(f => {
      this.fileObj = f;
      this.isImage = this.fileObj.mediaType.startsWith('image');
      //this.isVideo = this.fileObj.mediaType.startsWith('video');
    });
  }
  public viewURL(){
    return `http://${location.hostname}:${AppConfig.settings.file_port}/files('${this.id}')/$value`;
  }
}
