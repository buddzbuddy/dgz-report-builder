import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, debounceTime, finalize, map, startWith, switchMap, tap} from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';


@Component({
  selector: 'app-view-suppliers',
  templateUrl: './view-suppliers.component.html',
  styleUrls: ['./view-suppliers.component.scss']
})
export class ViewSuppliersComponent implements AfterViewInit, OnInit {

  constructor(private _httpClient: HttpClient, private router: Router, private _formBuilder: FormBuilder, ) { }
  suppliersDisplayedColumns: string[] = ['id', 'name', 'inn', 'legalAddress', '_ownership_type', '_industry'];
  httpDatabase: HttpDatabase | null;
  suppliersData: any[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  formGroup: FormGroup;
  ngAfterViewInit() {
    this.httpDatabase = new HttpDatabase(this._httpClient);

    this.fetchSuppliers([]);
    this.getOwnership_types();
    this.getIndustries();
    this.getLicense_types();
  }
  ngOnInit(){
    this.formGroup = this._formBuilder.group({
      ownership_type: '',
      inn: '',
      industry:'',
      license__license_type:''
    });
    this.searchNameCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredNames = [];
          this.isLoading = true;
        }),
        switchMap(value => this._httpClient.get(AppConfig.settings.host + "/api/AnalisingServices/SearchByName?src=" + value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredNames = data;
        console.log(this.filteredNames);
      });
    this.formGroup.addControl('name', this.searchNameCtrl);
  }
  searchNameCtrl = new FormControl();
  filteredNames: any;
  isLoading = false;

  fetchSuppliers(filterObj: any[]){
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.httpDatabase!.getSuppliers(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, filterObj, this.page_size);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.suppliersData = data);
  }
  navigateTo(row: any) {
    this.router.navigate(['/analitics/view-supplier/'+row.id]);
  }

  ownership_types: any[] = [];
  getOwnership_types(){
    const href = '/api/ownership_type';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.ownership_types = _;
    });
  }

  industries: any[] = [];
  getIndustries(){
    const href = '/api/industries';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.industries = _;
    });
  }
  license_types: any[] = [];
  getLicense_types(){
    const href = '/api/license_types';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(AppConfig.settings.host + requestUrl).subscribe(_ => {
      this.license_types = _;
    });
  }
  page_size: number = 5;
  applyFilter(){
    console.log(this.formGroup.value);
    console.log(this.page_size);
    if(this.page_size == null) this.page_size = 5;
    let filterObj: any[] = [];
    for(let f of Object.keys(this.formGroup.value)){
      if(this.formGroup.value[f] != null && this.formGroup.value[f] != ''){
        filterObj.push({ field_name: f, operation: '==', val: this.formGroup.value[f] });
      }
    }
    this.fetchSuppliers(filterObj);
  }

  clearFilter() {
    this.formGroup.reset();
    this.fetchSuppliers([]);
  }
  goBack(){
    
  }
  
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/** An example database that the data source uses to retrieve data for the table. */
export class HttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getSuppliers(sort: string, order: string, page: number, filterObj: any[], size: number): Observable<any> {
    const href = '/api/AnalisingServices/GetSuppliersByPage';
    const requestUrl = `${href}?size=${size}&sort=${sort}&order=${order}&page=${page + 1}`;
    return this._httpClient.post(AppConfig.settings.host + requestUrl, { conditions: filterObj }, httpOptions);
  }
}