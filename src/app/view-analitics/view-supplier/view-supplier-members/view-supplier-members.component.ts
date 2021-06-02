import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'view-supplier-members',
  templateUrl: './view-supplier-members.component.html',
  styleUrls: ['./view-supplier-members.component.scss']
})
export class ViewSupplierMembersComponent implements OnInit {

  constructor(public dialog: MatDialog,) { }

  @Input() supplierId: number = 0;
  ngOnInit() {
  }

  @Input() supplier_members: any[] = [];
  getDirectorName() : string {
    let managerName = '-';
    if(this.supplier_members){
      for (let index = 0; index < this.supplier_members.length; index++) {
        const m = this.supplier_members[index];
        if(m.memberType.name == 'Руководитель') {
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
}

@Component({
  selector: 'view-msec-details-dialog',
  templateUrl: 'view-msec-details-dialog.html',
})
export class ViewMsecDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewMsecDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
