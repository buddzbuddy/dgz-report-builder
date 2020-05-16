import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatTableDataSource } from '@angular/material';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment'
import { Router } from '@angular/router';

@Component({
  selector: 'app-unemployee-applications',
  templateUrl: './unemployee-applications.component.html',
  styleUrls: ['./unemployee-applications.component.scss']
})
export class UnemployeeApplicationsComponent implements OnInit {
  filterValues = {};
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['action', 'CreatedAt', 'PIN', 'PassportSeries', 'PassportNo', 'Bank', 'Telephone', 'Address', 'Status', 'StatusDate'];

  filterSelectObj = [];
  constructor(
    private dataSvc: DataService,
    private oauthService: OAuthService,
    private router: Router
  ) {

    // Object to create Filter for
    this.filterSelectObj = [
      {
        name: 'ПИН',
        columnProp: 'PIN',
        options: []
      },
      {
        name: 'Банк',
        columnProp: 'Bank',
        options: []
      },
      {
        name: 'Статус',
        columnProp: 'Status',
        options: []
      }
    ]
  }

  ngOnInit() {
    this.getRemoteData();

    // Overrride default filter behaviour of Material Datatable
    this.dataSource.filterPredicate = this.createFilter();
  }

  // Get Uniqu values from columns to build filter
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  // Get remote serve data using HTTP call
  getRemoteData() {

    let parsedList: any[] = [];
    let queryString = '$filter=DistrictResourceId eq {orgId}&$orderby=Id desc';
    let claims = this.oauthService.getIdentityClaims();
              if(claims != null && claims['orgId'] != null){
                queryString = queryString.replace('{orgId}', claims['orgId']);
              }
    this.dataSvc.filterODataResourceExpanded('ApplicantResources', queryString).subscribe(response => {

      response.value.map((_) => {
        parsedList.push({
          Id: _.Id,
          PIN: _.PIN,
          PassportSeries: _.PassportSeries,
          PassportNo: _.PassportNo,
          Address: _.Address,
          CreatedAt: moment(_.CreatedAt).format('DD.MM.YYYY HH:mm'),
          Telephone: _.Telephone,
          Bank: _.BankResourceId != null ? _.BankResource.Name : '-',
          Status: _.StatusResourceId != null ? _.StatusResource.Name : '-',
          StatusDate: _.StatusDate != null ? moment(_.StatusDate).format('DD.MM.YYYY HH:mm') : '-'
        });
      })
      this.dataSource.data = parsedList;

      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(parsedList, o.columnProp);
      });
    })


  }
  setStatus(appId: number){
    this.router.navigate(['unemployeeApplications/setstatus/' + appId]);
  }

  // Called on Filter change
  filterChange(filter, event) {
    //let filterValues = {}
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
    this.dataSource.filter = JSON.stringify(this.filterValues)
  }

  // Custom filter method fot Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      //console.log(searchTerms);

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }


  // Reset table filters
  resetFilters() {
    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    })
    this.dataSource.filter = "";
  }
}
