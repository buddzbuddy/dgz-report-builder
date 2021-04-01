import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-view-report-result',
  templateUrl: './view-report-result.component.html',
  styleUrls: ['./view-report-result.component.scss']
})
export class ViewReportResultComponent implements AfterViewInit, OnInit, OnDestroy {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  @Input() data: any[] = []
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  private eventsSubscription: Subscription;

@Input() events: Observable<void>;

ngOnInit(){
  this.eventsSubscription = this.events.subscribe(() => {
    this.columnsProps = this.selected_fields.map((column) => column.name);
    this.columnsCapts = this.toObject(this.selected_fields)
    this.dataSource = new MatTableDataSource(this.data);
  });
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
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}