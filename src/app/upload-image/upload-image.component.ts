import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html'
})
export class UploadImageComponent implements OnInit {

  constructor(private dataSvc: DataService) { }
  selectedFile : File = null;
  imgPreviewUrl: string = 'assets/images/preview.png';
  loadinImageUrl: string = 'assets/images/spinner-icon.gif'
  imgUrl: string = ''
  isLoading: boolean = false
  ngOnInit() {
    this.imgUrl = this.imgPreviewUrl;
  }
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];

    //show preview
    /*var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imgUrl = event.target.result;
    }
    reader.readAsDataURL(this.selectedFile);*/
  }

  onUpload(){
    this.imgUrl = this.loadinImageUrl;
          this.isLoading = true;
    this.dataSvc.postFile(this.selectedFile).subscribe(event => {
      if(event.type === HttpEventType.UploadProgress){
        console.log('Upload progress: ' + Math.round(event.loaded / event.total * 100) + '%')
      } else if(event.type === HttpEventType.Response) {
        console.log(event.body.id);
        this.onClear();
      }
    });
  }
  onClear(){
    this.selectedFile = null;
    this.imgUrl = this.imgPreviewUrl;
    this.isLoading = false;
  }
}
