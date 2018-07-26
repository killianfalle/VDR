import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { LoaderComponent } from '../../components/loader/loader';
import moment from 'moment';

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
  void_reports:any = [];  
  release_reports:any = [];  

  search_date: any = moment().format('YYYY-MM-DD');

  isBusy: any = false;

  public options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Order #','First Name','Last Name','Release Date','Product','Class','Size','Type','Qty','Price','Total'],
    showTitle: false,
    useBom: true,
    removeNewLines: false
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider,
    public loader: LoaderComponent) {
  }

  ngOnInit() {
    this.void_reports = [];
    this.release_reports = [];
    this.isBusy = false;
    /*this.isBusy = false;
    this.provider.getData({ date : this.search_date },'report').then((res: any) => {
      if(res._data.status){
        this.reports = res._data.data;
      }
      this.isBusy = true;
    });*/
    this.void();
    this.release();
  }

  export() {
    this.isBusy = false;
    this.provider.getData({ date : this.search_date },'report/export').then((res: any) => {
      if(res._data.status){
       this.generate(res._data.data);
      }
      this.isBusy = true;
    })
  }

  generate(_data){
    new Angular2Csv(_data,'Report', this.options);
  }

  void() {
    this.provider.getData({ date : this.search_date, status : 'void' },'report/void').then((res:any) => {
      if(res._data.status){
        this.void_reports = res._data.data;
      }
    });
  }

  release() {
    this.provider.getData({ date : this.search_date, status : 'cleared' },'report/release').then((res:any) => {
      if(res._data.status){
        this.release_reports = res._data.data;
      }
      this.isBusy = true;
    });
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
