import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, debounceTime, finalize, map, startWith, switchMap, tap} from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-view-suppliers',
  templateUrl: './view-suppliers.component.html',
  styleUrls: ['./view-suppliers.component.scss'],
  providers:[
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    //{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}
  ]
})
export class ViewSuppliersComponent implements AfterViewInit, OnInit {

  constructor(private _httpClient: HttpClient, private router: Router, private _formBuilder: FormBuilder, ) { }
  suppliersDisplayedColumns: string[] = ['id', 'name', 'inn', 'legalAddress', 'ownershipTypeId', 'industryId'];
  httpDatabase: HttpDatabase | null;
  suppliersData: MatTableDataSource<any> = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  formGroup: FormGroup;
  ngAfterViewInit() {
    this.httpDatabase = new HttpDatabase(this._httpClient);

    this.fetchSuppliers({searchQuery:{}});
    this.getOwnership_types();
    this.getIndustries();
    this.getLicense_types();
  }
  ngOnInit(){
    this.formGroup = this._formBuilder.group({
      ownershipTypeId: '',
      inn: '',
      industryId:''
    });
  }
  filteredNames: any;
  isLoading = false;

  fetchSuppliers(filterObj: any){
    this.isLoadingResults = true;
    this.httpDatabase.getSuppliers(filterObj).subscribe(_ => {
      this.suppliersData = new MatTableDataSource(_.data);
      this.suppliersData.paginator = this.paginator;
      this.suppliersData.sort = this.sort;
      this.isLoadingResults = false;
    });
  }
  navigateTo(row: any) {
    this.router.navigate(['/analitics/view-supplier/'+row.id]);
  }

  ownership_types: any[] = [];
  getOwnership_types(){
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: "OwnershipType"
    }
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.ownership_types = _['data'];
    });
  }

  industries: any[] = [];
  getIndustries(){
    let obj = {
      rootName: "Industry"
    }
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.industries = _['data'];
    });
  }
  license_types: any[] = [];
  getLicense_types(){
    let obj = {
      rootName: "LicenseType"
    }
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post(AppConfig.settings.host + requestUrl, obj).subscribe(_ => {
      this.license_types = _['data'];
    });
  }


  parseSelect(fieldName: string, valId: number) : string {
    let valName = ""

    if(fieldName == 'ownershipTypeId') {
      for (let index = 0; index < this.ownership_types.length; index++) {
        const e = this.ownership_types[index];
        if(e.id == valId) {
          return e.name;
        }
      }
    }
    if(fieldName == 'industryId') {
      for (let index = 0; index < this.industries.length; index++) {
        const e = this.industries[index];
        if(e.id == valId) {
          return e.name;
        }
      }
    }

    return valName;
  }

  isChecked1 = false
  spec1 = {
    
  }
  isChecked2 = false
  spec2 = {

  }
  isChecked3 = false
  spec3 = {

  }
  isChecked4 = false
  spec4 = {

  }
  isChecked5 = false
  spec5 = {

  }

  applyFilter(){
    let filterObj: any[] = [];
    for(let f of Object.keys(this.formGroup.value)){
      if(this.formGroup.value[f] != null && this.formGroup.value[f] != ''){
        filterObj.push({ property: f, operator: '=', value: this.formGroup.value[f] });
      }
    }
    let obj = {
      searchQuery: {
        searchFitler: filterObj
      }
    };
    if(this.isChecked1) {
      obj['spec1'] = this.spec1;
    }
    if(this.isChecked2) {
      obj['spec2'] = this.spec2;
    }
    if(this.isChecked3) {
      obj['spec3'] = this.spec3;
    }
    if(this.isChecked4) {
      obj['spec4'] = this.spec4;
    }
    if(this.isChecked5) {
      obj['spec5'] = this.spec5;
    }
    this.fetchSuppliers(obj);
  }

  clearFilter() {
    this.formGroup.reset();
    this.fetchSuppliers({searchQuery:{}});
  }
  goBack(){
    
  }
  
}
/** An example database that the data source uses to retrieve data for the table. */
export class HttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getSuppliers(filterObj: any): Observable<any> {
    const href = 'data-api/supplier-requests/exec';
    const requestUrl = `${href}`;
    return this._httpClient.post(AppConfig.settings.host + requestUrl, filterObj);
  }
}