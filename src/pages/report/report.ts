import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { LoaderComponent } from '../../components/loader/loader';

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
  search_date: any = '';

  isBusy: any = false;

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
    public provider: DataProvider,
    public loader: LoaderComponent) {
  }

  ngOnInit() {
    this.isBusy = false;
    this.provider.getData({ date : this.search_date },'report').then((res: any) => {
      if(res._data.status){
        this.reports = res._data.data;
      }
      this.isBusy = true;
    });
  }

  exportCSV() {
    new Angular2Csv(this.reports,'Report', this.options);
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
