import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
@Component({
  selector: 'app-view-map-history',
  templateUrl: './view-map-history.component.html',
  styleUrls: ['./view-map-history.component.scss']
})
export class ViewMapHistoryComponent implements OnInit {
  
  constructor(private route: ActivatedRoute,private dataSvc: DataService) { }
  
  appUserId: number = 0;

  res: any = null

  ngOnInit() {
    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['appUserId'] != null) {
          this.appUserId = params['appUserId'];
          this.dataSvc.customApi_GetAppUserDetails(this.appUserId).subscribe(res => {
            if(res.geoItems.length) {
              
              this.appUserDetails = res;
              let geoItems = []

              if(res.geoItems.length){
                res.geoItems.forEach(geoItem => {
                  geoItems.push([geoItem.lat, geoItem.lng])
                });
              }

              this.res = {
                geoItems
              }
              //console.log(geoItems);
            }
          });
        }
      });
    }
  }

  appUserDetails: any = null
  getAppUserDetails(){
    if(this.appUserId != 0){
      
    }
  }

}
