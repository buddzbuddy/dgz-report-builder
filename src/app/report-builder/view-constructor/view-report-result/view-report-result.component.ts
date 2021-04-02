import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-report-result',
  templateUrl: './view-report-result.component.html',
  styleUrls: ['./view-report-result.component.scss']
})
export class ViewReportResultComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  private _data = new BehaviorSubject<any[]>([]);
  @Input()  set data(value: any[]) { 
    this._data.next(value); 
}
get data() {
  return this._data.getValue();
}
  @Input() selected_fields: any[] = []
  public columnsProps: string[] = [];
  public columnsCapts: any = {}
  constructor() {
  }

  toObject(arr: any[]):any {
    var r = {}
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      r[el.name] = el.label
    }
    return r;
  }
  private eventsSubscription: Subscription;

@Input() events: Observable<void>;

ngOnInit(){
  this.eventsSubscription = this.events.subscribe(() => {
    this.columnsProps = this.selected_fields.map((column) => column.name);
    this.columnsCapts = this.toObject(this.selected_fields)
  });
  this._data.subscribe(x => {
    this.dataSource = new MatTableDataSource(x);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
 })
}

ngOnDestroy() {
  this.eventsSubscription.unsubscribe();
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}