import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { FieldConfig, CollectionItem } from "../../field.interface";
import { MatSelect } from '@angular/material/select';
import { Subject, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
@Component({
  selector: "app-select",
  templateUrl: './select.component.html',
  styles: []
})
export class SelectComponent implements OnInit/*, AfterViewInit, OnDestroy*/ {

  field: FieldConfig;

  group: FormGroup;
  /** control for the MatSelect filter keyword */
  public filterCtrl: FormControl = new FormControl();
  @ViewChild('singleSelect', null) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  //protected _onDestroy = new Subject<void>();

  public filteredCollection: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  constructor() {}
  ngOnInit() {

    // load the initial bank list
    this.filteredCollection.next(this.field.collections);

    // listen for search field value changes
    this.filterCtrl.valueChanges
    //.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCollection();
    });
  }
  /*ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }*/

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredCollection
      //.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: CollectionItem, b: CollectionItem) => a && b && a.id === b.id;
      });
  }
  protected filterCollection() {

    if (!this.field.collections) {
      return;
    }
    // get the search keyword
    let search = this.filterCtrl.value;
    console.log(search);
    if (!search) {
      this.filteredCollection.next(this.field.collections.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCollection.next(
      this.field.collections.filter(item => item.text.toLowerCase().indexOf(search) > -1)
    );
  }
}
