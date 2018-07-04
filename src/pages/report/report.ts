import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
export class ReportPage {

  record:any = [];  

  public options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Class','Size','Type','Qty','Date Release'],
    showTitle: false,
    useBom: true,
    removeNewLines: false
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.load_data();
  }

  load_data(){
  	this.record = [
  		{
  			class : 'Breeder',
  			size: 'Small',
  			type : 'Tray',
  			qty: '5',
  			release: '2018-01-01'
  		},
  		{
  			class : 'Breeder',
  			size: 'Large',
  			type : 'Pc',
  			qty: '7',
  			release: '2018-01-01'
  		},
  	];
  }

  exportCSV(){
    new Angular2Csv(this.record,'Report', this.options);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

}
