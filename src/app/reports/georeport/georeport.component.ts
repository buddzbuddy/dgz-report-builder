import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment'
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-georeport',
  templateUrl: './georeport.component.html',
  styleUrls: ['./georeport.component.scss']
})
export class GeoreportComponent implements OnInit {
  constructor(
    private router: Router, private oauthService: OAuthService, private dataSvc: DataService
  ){}
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['action', 'createdAt', 'pin', 'nickname', 'telephone'];
  pinFilter = new FormControl();
  nameFilter = new FormControl();
  private filterValues = { pin: '', nickname: '' }
  filteredValues = {
    pin: '', nickname: ''
  };

  ngOnInit() {
    this.getRemoteData();
  }
  applyFilter(filterValue: string) {
    let filter = {
      nickname: filterValue.trim().toLowerCase(),
      pin: filterValue.trim().toLowerCase()
    }
    this.dataSource.filter = JSON.stringify(filter)
  }

  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter)
      let idSearch = data.pin.toString().indexOf(searchTerms.pin) != -1
      let nameSearch = () => {
        let found = false;
        searchTerms.nickname.trim().toLowerCase().split(' ').forEach(word => {
          if (data.nickname.toLowerCase().indexOf(word) != -1) { found = true }
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
    /*let queryString = '$filter=UserId eq {UserId}&$orderby=Id desc';
    let claims = this.oauthService.getIdentityClaims();
              if(claims != null && claims['sub'] != null){
                queryString = queryString.replace('{UserId}', claims['sub']);
              }*/
    this.dataSvc.customApi_AppUserGetAll().subscribe(response => {

      response.map((_) => {
        parsedList.push({
          id: _.id,
          pin: _.pin,
          nickname: _.nickname,
          telephone: _.telephone,
          createdAt: moment(_.createdAt).format('DD.MM.YYYY HH:mm')
        });
      })
      this.dataSource.data = parsedList;

      this.pinFilter.valueChanges.subscribe((pinFilterValue) => {
        console.log(pinFilterValue);

        this.filteredValues['pin'] = pinFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });


      this.nameFilter.valueChanges
        .subscribe(value => {
          this.filterValues['nickname'] = value
          this.dataSource.filter = JSON.stringify(this.filterValues)
        });
      this.dataSource.filterPredicate = this.createFilter();
    })
  
  
  }
}
