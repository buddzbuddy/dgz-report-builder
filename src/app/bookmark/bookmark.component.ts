import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {

  constructor(private dataService: DataService) { }

  bookmarks: any[] = null
  ngOnInit() {
    this.dataService.getBookmarks().subscribe(data => {
      this.bookmarks = data.value;
    });
  }

}
