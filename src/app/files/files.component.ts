import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
export class FilesComponent implements OnInit {

  constructor(private dataSvc: DataService) { }
  public files: any[] = []
  ngOnInit() {
    this.dataSvc.getFiles().subscribe(f => {
      this.files = f.value
    });
  }
  public viewSize(size: number) {
    let kb = Math.round(size / 1024);
    if (kb < 1024) return `${kb} KB`;
    else return Math.round(kb / 1024) + ' MB';
  }

  public deleteFile(id: string) {
    if(confirm('Вы уверены что хотите удалить эту запись?')){
      this.dataSvc.deleteFile(id).subscribe(_ => {
        this.dataSvc.getFiles().subscribe(f => {
          this.files = f.value
        });
      });
    }
  }
}
