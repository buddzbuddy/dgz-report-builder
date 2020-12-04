import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { EditListTileDialog, NewListTileDialog } from 'src/app/customs/flutter/list-view-widget/list-view-widget.component';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-view-source-list',
  templateUrl: './view-source-list.component.html',
  styleUrls: ['./view-source-list.component.scss']
})
export class ViewSourceListComponent implements OnInit {

  mySubscription: any;
  constructor(private route: ActivatedRoute,
    private dataSvc: DataService,
    public dialog: MatDialog,
    private router: Router,) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      
      this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
        }
      });
     }

     ngOnDestroy() {
      if (this.mySubscription) {
        this.mySubscription.unsubscribe();
      }
    }

    nextToSource(){
      this.router.navigate(['report-builder/view-constructor'])
    }
    goBack(){
      window.history.back();
    }

    viewType: string = 'list'
    listViewId: number = 0
    pageId: number = 0
  ngOnInit() {
    this.getWidget();
  }
  widgetInfo: any = {}
  getWidget(){
    if(this.viewType == 'list'){
      this.dataSvc.customApi_WidgetsGetListView(8).subscribe(_ => {
        this.widgetInfo = _;
        console.log(_);
      });
    }
    else if(this.viewType == 'page'){
      this.dataSvc.customApi_WidgetsGetPage(this.pageId).subscribe(_ => {
        this.widgetInfo = _;
        console.log(_);
      });
    }
    
  }
  
  editTile(tileComponent:any){
    const dialogRef = this.dialog.open(EditListTileDialog, {
      data: {
        tileId: tileComponent.custom_props.id,
        leading_icon: tileComponent.leading.data,
        title_name: tileComponent.title.data
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getWidget();
    });
  }
  
  newTile() {
    const dialogRef = this.dialog.open(NewListTileDialog, {
      data: {
        listViewId: this.listViewId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getWidget();
    });
  }
}
