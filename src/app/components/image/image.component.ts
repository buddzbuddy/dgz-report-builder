import { Component, OnInit } from '@angular/core';
import { FieldConfig } from 'src/app/field.interface';
import { FormGroup } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { DataService } from 'src/app/data.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor(private dataSvc: DataService) { }
  selectedFile : File = null;
  imgPreviewUrl: string = 'assets/images/preview.png';
  loadinImageUrl: string = 'assets/images/spinner-icon.gif'
  imgUrl: string = ''
  progress: string = ''
  ngOnInit() {
    this.imgUrl = this.imgPreviewUrl;
    if(this.field.value) {
      this.imgUrl = this.viewURL(this.field.value);
    }
  }
  onFileSelected(event) {
    if(event.target.files[0]){
      this.imgUrl = this.loadinImageUrl;
      this.dataSvc.postFile(event.target.files[0]).subscribe(event => {
        //console.log(event);
        if(event.type === HttpEventType.UploadProgress){
          this.progress = 'Upload progress: ' + Math.round(event.loaded / event.total * 100) + '%'
        } else if(event.type === HttpEventType.Response) {
          this.onClear();
          this.field.value = event.body.id;
          this.group.controls[this.field.name].setValue(this.field.value);
          this.progress = null;
        }
      });
    }
  }
  public viewURL(id: string){
    return `http://${location.hostname}:${AppConfig.settings.file_port}/files('${id}')/$value`;
  }
  onClear(){
    this.selectedFile = null;
    this.imgUrl = this.imgPreviewUrl;
  }
}
