import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { isArray, isObject } from 'util';


@Component({
  selector: 'app-sod-data',
  templateUrl: './sod-data.component.html',
  styleUrls: ['./sod-data.component.scss']
})
export class SodDataComponent implements OnInit {

  @Input() pin: string
  @Input() passportSeries: string
  @Input() passportNo: string

  isPassportDataLoading = true;
  isISRTDataLoading = true;
  passportData: any = {};
  isrtData: any = {};
  constructor(private dataSvc: DataService) { }

  ngOnInit() {
    this.loadPassportData();
    this.loadISRTData();
    this.loadActivePaymentsByPIN();
    this.loadWorkPeriodInfo();
    this.loadBusinessActivityDateByInn();
  }

  loadPassportData(){
    this.isPassportDataLoading = true;
    this.dataSvc.customApi_getPassportData(this.pin, this.passportSeries, this.passportNo).subscribe((_) => {
      this.passportData = _;
      if(_.faultcode != null) {
        this.passportData.error = "Гражданин не найден!"
      }

      this.isPassportDataLoading = false;
    })
  }
  loadISRTData(){
    this.isISRTDataLoading = true;
    this.dataSvc.customApi_getISRTData(this.pin).subscribe((_) => {
      this.isrtData = _;
      this.isISRTDataLoading = false;
    });
  }
  parseISRTStatus(statusId: number){
    if(statusId == -1)
        return 'Отсутствует регистрация';
        else if(statusId == 0)
          return 'Есть регистрация но нет статуса';
          else if (statusId == 1)
            return 'Есть официальный статус безработного';
            else return 'Статус не определен';
  }
  isloadActivePaymentsByPIN: boolean = false;
  activePaymentsByPIN: any = null;
  loadActivePaymentsByPIN(){
    this.isloadActivePaymentsByPIN = true;
    this.dataSvc.customApi_GetActivePaymentsByPIN(this.pin).subscribe((_) => {
      this.activePaymentsByPIN = _;
      this.isloadActivePaymentsByPIN = false;
    });
  }
  isloadWorkPeriodInfo: boolean = false;
  workPeriodInfo: any[] = [];
  loadWorkPeriodInfo(){
    this.isloadWorkPeriodInfo = true;
    this.dataSvc.customApi_GetWorkPeriodInfo(this.pin).subscribe((_) => {
      if(_.WorkPeriods != null) {
        if(isArray(_.WorkPeriods.WorkPeriod)) {
          this.workPeriodInfo = _.WorkPeriods.WorkPeriod.slice(Math.max(_.WorkPeriods.WorkPeriod.length - 10, 0));
        }
        else if (isObject(_.WorkPeriods.WorkPeriod)) {
          this.workPeriodInfo.push(_.WorkPeriods.WorkPeriod);
        }
      }
      this.isloadWorkPeriodInfo = false;
    });
  }
  isLoadBusinessActivityDateByInn: boolean = false;
  businessActivityDateByInn: any = null;
  loadBusinessActivityDateByInn(){
    this.isLoadBusinessActivityDateByInn = true;
    this.dataSvc.customApi_TPBusinessActivityDateByInn(this.pin).subscribe((_) => {
      if(_ != null) {
        this.dataSvc.filterODataResource('TaxTypeResources', `$filter=Code eq '${_.TaxTypeCode.trim()}'`).subscribe((s) => {
          this.businessActivityDateByInn = _;
          this.businessActivityDateByInn.TaxType = s.value[0];
          this.isLoadBusinessActivityDateByInn = false;
        });
      }
      else {
        this.businessActivityDateByInn = _;
        this.isLoadBusinessActivityDateByInn = false;
      }
    });
  }
}
