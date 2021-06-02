import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-list-view-widget',
  templateUrl: './list-view-widget.component.html',
  styleUrls: ['./list-view-widget.component.scss']
})
export class ListViewWidgetComponent implements OnInit, OnDestroy {
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

    goBack(){
      window.history.back();
    }

    viewType: string = 'list'
    listViewId: number = 0
    pageId: number = 0
  ngOnInit() {
    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['routeData'] != null) {
          let routeData = params['routeData'];
          this.viewType = routeData.split('-')[0];
          if(this.viewType == 'list'){
            this.listViewId = parseInt(routeData.split('-')[1]);
          }
          if(this.viewType == 'page'){
            this.pageId = parseInt(routeData.split('-')[1]);
          }
          
          this.getWidget();
        }
      });
    }
  }
  newTile() {
    /*const dialogRef = this.dialog.open(NewListTileDialog, {
      data: {
        listViewId: this.listViewId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getWidget();
    });*/
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
  removeTile(tileId:number){
    this.dataSvc.customApi_WidgetsRemoveTile(tileId).subscribe(_ => {
      this.getWidget();
    });
  }
  removeList(listId:number){
    this.dataSvc.customApi_WidgetsRemoveList(listId).subscribe(_ => {
      this.goBack();
    });
  }
  removePage(pageId:number){
    this.dataSvc.customApi_WidgetsRemovePage(pageId).subscribe(_ => {
      this.goBack();
    });
  }

  newList(list_tile_component_id: number) {
    const dialogRef = this.dialog.open(NewListViewDialog, {
      data: {
        list_tile_component_id
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getWidget();
    });
  }

  newPage(list_tile_component_id: number) {
    const dialogRef = this.dialog.open(NewPageDialog, {
      data: {
        list_tile_component_id
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getWidget();
    });
  }

  newText() {
    const dialogRef = this.dialog.open(NewTextDialog, {
      data: {
        pageId: this.pageId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getWidget();
    });
  }
  editText(textComponent:any){
    const dialogRef = this.dialog.open(EditTextDialog, {
      data: {
        textId: textComponent.custom_props.id,
        data: textComponent.data
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getWidget();
    });
  }
  removeText(textId:number){
    this.dataSvc.customApi_WidgetsRemoveText(textId).subscribe(_ => {
      this.getWidget();
    });
  }
  openList(nexListId){
    this.router.navigate(['flutter/list-view-widget/list-' + nexListId]);
  }
  openPage(nexPageId){
    this.router.navigate(['flutter/list-view-widget/page-' + nexPageId]);
  }

  widgetInfo: any = {}
  getWidget(){
    if(this.viewType == 'list'){
      this.dataSvc.customApi_WidgetsGetListView(this.listViewId).subscribe(_ => {
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
}

export interface EditListTileDialogData {
  tileId: number;
  leading_icon: string;
  title_name: string;
}
@Component({
  selector: 'edit-list-tile-dialog',
  templateUrl: 'edit-list-tile-dialog.html',
})
export class EditListTileDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditListTileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditListTileDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        leading_icon: this.data.leading_icon,
        title_name: this.data.title_name,
      });
    }
  onSaveClick(): void {
    
    let obj = {
      ...this.formGroup.value
    };
    this.dataSvc.customApi_WidgetsEditTile(this.data.tileId, obj).subscribe(_ => {
      this.dialogRef.close();
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

export interface NewListViewDialogData {
  list_tile_component_id: number;
}
@Component({
  selector: 'new-list-view-dialog',
  templateUrl: 'new-list-view-dialog.html',
})
export class NewListViewDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NewListViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewListViewDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        title: '',
      });
    }
  onSaveClick(): void {
    let obj = {
      list_tile_component_id: this.data.list_tile_component_id,
      ...this.formGroup.value
    };
    this.dataSvc.customApi_WidgetsCreateListView(obj).subscribe(_ => {
      this.dialogRef.close();
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}


export interface NewPageDialogData {
  list_tile_component_id: number;
}
@Component({
  selector: 'new-page-dialog',
  templateUrl: 'new-page-dialog.html',
})
export class NewPageDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NewPageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewPageDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        title: '',
      });
    }
  onSaveClick(): void {
    let obj = {
      list_tile_component_id: this.data.list_tile_component_id,
      ...this.formGroup.value
    };
    this.dataSvc.customApi_WidgetsCreatePage(obj).subscribe(_ => {
      this.dialogRef.close();
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

export interface NewTextDialogData {
  pageId: number;
}
@Component({
  selector: 'new-text-dialog',
  templateUrl: 'new-text-dialog.html',
})
export class NewTextDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NewTextDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewTextDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        data: ''
      });
    }
  onSaveClick(): void {
    
    let obj = {
      pageId: this.data.pageId,
      ...this.formGroup.value
    };
    this.dataSvc.customApi_WidgetsAddTextComponent(obj).subscribe(_ => {
      this.dialogRef.close();
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
export interface EditTextDialogData {
  textId: number;
  data: string;
}
@Component({
  selector: 'new-text-dialog',
  templateUrl: 'new-text-dialog.html',
})
export class EditTextDialog implements OnInit{
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditTextDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditTextDialogData,
    private dataSvc: DataService, private _formBuilder: FormBuilder) {}
    ngOnInit() {
      this.formGroup = this._formBuilder.group({
        data: this.data.data
      });
    }
  onSaveClick(): void {
    
    let obj = {
      ...this.formGroup.value
    };
    this.dataSvc.customApi_WidgetsEditText(this.data.textId, obj).subscribe(_ => {
      this.dialogRef.close();
    });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}