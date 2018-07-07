import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage implements OnInit {

  reports:any = [];  

  public options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Transaction #','First Name','Last Name','Release Date','Product','Class','Size','Type','Qty','Price','Total'],
    showTitle: false,
    useBom: true,
    removeNewLines: false
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider) {
  }

  ngOnInit() {
    this.provider.getData('','get_report').then((res: any) => {
      if(res._data.status){
        this.reports = res._data.data;
      }
    });
  }

  exportCSV(){
    new Angular2Csv(this.reports,'Report', this.options);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

}
