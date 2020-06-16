import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {

  constructor() { }
  period1: any = {
    r_2_1: 0,
    r_2_1_1: 0,
    r_2_2: 0,
    r_3_1: 0,
    r_3_2: 0,
    r_3_3: 0,
    r_3_4: 0,
    r_3_5: 0,
    r_3_6: 0,
    r_3_7: 0,
    r_3_8: 0,
    r_3_9: 0,
    r_3_10: 0,
    r_3_11: 0,
    r_4_1: 0,
    r_4_2: 0,
    r_5_1: 0,
    r_5_2: 0,
    r_6_1: 0,
    r_6_2: 0,
    r_6_3: 0,
    r_6_4: 0,
    r_6_5: 0,
    r_6_6: 0,
    r_7_1: 0,
    r_7_2: 0,
    r_7_3: 0,
    r_7_4: 0,
    r_7_5: 0,
    r_7_6: 0,
    r_7_7: 0,
    r_7_8: 0,
    r_9: 0,
    r_10: 0,
    r_11: 0,
    r_12: 0,
  }
  period2: any = {
    r_2_1: 0,
    r_2_1_1: 0,
    r_2_2: 0,
    r_3_1: 0,
    r_3_2: 0,
    r_3_3: 0,
    r_3_4: 0,
    r_3_5: 0,
    r_3_6: 0,
    r_3_7: 0,
    r_3_8: 0,
    r_3_9: 0,
    r_3_10: 0,
    r_3_11: 0,
    r_4_1: 0,
    r_4_2: 0,
    r_5_1: 0,
    r_5_2: 0,
    r_6_1: 0,
    r_6_2: 0,
    r_6_3: 0,
    r_6_4: 0,
    r_6_5: 0,
    r_6_6: 0,
    r_7_1: 0,
    r_7_2: 0,
    r_7_3: 0,
    r_7_4: 0,
    r_7_5: 0,
    r_7_6: 0,
    r_7_7: 0,
    r_7_8: 0,
    r_9: 0,
    r_10: 0,
    r_11: 0,
    r_12: 0,
  }
  period3: any = {
    r_2_1: 0,
    r_2_1_1: 0,
    r_2_2: 0,
    r_3_1: 0,
    r_3_2: 0,
    r_3_3: 0,
    r_3_4: 0,
    r_3_5: 0,
    r_3_6: 0,
    r_3_7: 0,
    r_3_8: 0,
    r_3_9: 0,
    r_3_10: 0,
    r_3_11: 0,
    r_4_1: 0,
    r_4_2: 0,
    r_5_1: 0,
    r_5_2: 0,
    r_6_1: 0,
    r_6_2: 0,
    r_6_3: 0,
    r_6_4: 0,
    r_6_5: 0,
    r_6_6: 0,
    r_7_1: 0,
    r_7_2: 0,
    r_7_3: 0,
    r_7_4: 0,
    r_7_5: 0,
    r_7_6: 0,
    r_7_7: 0,
    r_7_8: 0,
    r_9: 0,
    r_10: 0,
    r_11: 0,
    r_12: 0,
  }
  isGenerated: boolean = false;
  isLoading: boolean = false;
  ngOnInit() {

  }

  generateReport(){
    this.isGenerated = false;
    this.isLoading = true;
    setTimeout(() => this.calc(), 3000);
  }

  calc() {
    Object.keys(this.period1).forEach((key) => {
      this.period1[key] = this.randomIntFromInterval(0, 10);
      this.period2[key] = this.randomIntFromInterval(0, 10);
    });
    this.isLoading = false;
    this.isGenerated = true;
  }
  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
