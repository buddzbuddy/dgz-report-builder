import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatTableDataSource } from '@angular/material';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment'
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-living-persons',
  templateUrl: './living-persons.component.html',
  styleUrls: ['./living-persons.component.scss']
})
export class LivingPersonsComponent implements OnInit {
  constructor(
    private router: Router, private oauthService: OAuthService, private dataSvc: DataService
  ){}
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['action', 'CreatedAt', 'PIN', 'FullName', 'Telephone'];
  pinFilter = new FormControl();
  nameFilter = new FormControl();
  private filterValues = { PIN: '', FullName: '' }
  filteredValues = {
    PIN: '', FullName: ''
  };

  ngOnInit() {
    this.getRemoteData();
  }
  applyFilter(filterValue: string) {
    let filter = {
      name: filterValue.trim().toLowerCase(),
      PIN: filterValue.trim().toLowerCase()
    }
    this.dataSource.filter = JSON.stringify(filter)
  }

  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter)
      let idSearch = data.PIN.toString().indexOf(searchTerms.PIN) != -1
      let nameSearch = () => {
        let found = false;
        searchTerms.FullName.trim().toLowerCase().split(' ').forEach(word => {
          if (data.FullName.toLowerCase().indexOf(word) != -1) { found = true }
        });
        return found
      }
      return idSearch && nameSearch()
    }
    return filterFunction
  }
  // Get remote serve data using HTTP call
  getRemoteData() {

    let parsedList: any[] = [];
    let queryString = '$filter=UserId eq {UserId}&$orderby=Id desc';
    let claims = this.oauthService.getIdentityClaims();
              if(claims != null && claims['sub'] != null){
                queryString = queryString.replace('{UserId}', claims['sub']);
              }
    this.dataSvc.filterODataResourceExpanded('PersonResources', queryString).subscribe(response => {

      response.value.map((_) => {
        parsedList.push({
          Id: _.Id,
          PIN: _.PIN,
          FullName: _.FullName,
          CreatedAt: moment(_.CreatedAt).format('DD.MM.YYYY HH:mm'),
          Telephone: _.Telephone
        });
      })
      this.dataSource.data = parsedList;

      this.pinFilter.valueChanges.subscribe((pinFilterValue) => {
        console.log(pinFilterValue);

        this.filteredValues['PIN'] = pinFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });


      this.nameFilter.valueChanges
        .subscribe(value => {
          this.filterValues['FullName'] = value
          this.dataSource.filter = JSON.stringify(this.filterValues)
        });
      this.dataSource.filterPredicate = this.createFilter();
    })
  }

  createNew() {
    this.router.navigate(['/living-persons/create'])
  }
}
