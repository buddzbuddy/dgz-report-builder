import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'view-supplier-members',
  templateUrl: './view-supplier-members.component.html',
  styleUrls: ['./view-supplier-members.component.scss']
})
export class ViewSupplierMembersComponent implements OnInit {

  constructor(public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['supplierId'] != null) {
          this.isCabinet = false;
        }
      });
    }
  }

  @Input() supplier_members: any[] = [];
  getDirectorName(): string {
    let managerName = '-';
    if (this.supplier_members) {
      for (let index = 0; index < this.supplier_members.length; index++) {
        const m = this.supplier_members[index];
        if (m.memberType.name == 'Руководитель') {
          managerName = m.surname + ' ' + m.name + ' ' + (m.patronymic || '');
        }
      }
    }
    return managerName;
  }

  viewMsecDetails(mem) {
    const dialogRef = this.dialog.open(ViewMsecDetailsDialog, {
      data: mem
    });
  }

  isCabinet = true;
  @Output() removeEvent = new EventEmitter<number>();
  remove(id: number) {
    this.removeEvent.emit(id);
  }
}

@Component({
  selector: 'view-msec-details-dialog',
  templateUrl: 'view-msec-details-dialog.html',
})
export class ViewMsecDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewMsecDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data) { }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
