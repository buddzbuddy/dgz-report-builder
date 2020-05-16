import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
export interface DialogData {
  reason: string;
  isRejected: boolean
}
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  resetFormSubject: Subject<boolean> = new Subject<boolean>();
  constructor(private route: ActivatedRoute,
    private dataSvc: DataService,
    private ref: ChangeDetectorRef,
    public dialog: MatDialog)
  { }
  appId: number = 0
  app: any = null
  ngOnInit() {
    if (this.route.params != null){
      this.route.params.subscribe(params => {
        if (params['appId'] != null) {
          this.appId = params['appId'];
          this.dataSvc.getODataResourceItem('ApplicantResources', this.appId).subscribe(_ => this.app = _)
        }
      });
    }
  }
  accept() {
    this.dataSvc.customApi_acceptApp(this.appId).subscribe(_ => {
      this.resetFormSubject.next(true);
    })
  }
  onRejectClicked() {
    const dialogRef = this.dialog.open(RejectDialog, {
      width: '250px',
      data: {reason: '', isRejected: true}
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data.isRejected) {
        this.dataSvc.customApi_rejectApp(this.appId, data.reason).subscribe(_ => {
          this.resetFormSubject.next(true);
        })
      }
    });
  }
}
@Component({
  selector: 'app-reject-dialog',
  templateUrl: 'app-reject-dialog.html',
})
export class RejectDialog {

  constructor(
    public dialogRef: MatDialogRef<RejectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.data.isRejected = false;
    this.dialogRef.close(this.data);
  }

}
