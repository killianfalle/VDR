import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { PrinterProvider } from '../../providers/printer';
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

  report_tab: any = 'daily-report';

  reports:any = [];  
  void_reports:any = [];  
  release_reports:any = [];  

  search_date: any = moment().format('YYYY-MM-DD');

  isBusy: any = false;

  public options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Order #','First Name','Last Name','Release Date','Product','Class','Size','Qty_Type','Qty','Price','Total'],
    showTitle: false,
    useBom: true,
    removeNewLines: false
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    private printer: PrinterProvider) {
  }

  ngOnInit() {
    switch (this.report_tab) {
      case "sales-report":
        this.void_reports = [];
        this.release_reports = [];
        this.isBusy = false;
        this.void();
        this.release();
        break;
      default:
        this.get_daily_report();
        break;
    }
  }

  get_daily_report() {
    this.isBusy = false;
    this.provider.getData({ date : this.search_date },'report').then((res: any) => {
      if(res._data.status){
        this.reports = res._data.data;
      }
      this.isBusy = true;
    });
  }

  export() {
    if(this.reports.length > 0){
      this.isBusy = false;
      this.provider.getData({ date : this.search_date },'report/export').then((res: any) => {
        if(res._data.status){
         this.generate(res._data.data);
        }
        this.isBusy = true;
      })
    }else {
      this.alert.show_dialog('Invalid','Can\'t export data. No result found.');
    }
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

  print(type) {
    this.printer.is_enabled().then((res: any) => {
      this.verify_connectivity(type);
    }).catch((err) => {
      this.enable_blueetooth(type);
    });
  }

  enable_blueetooth(type) {
    this.printer.set_enable().then((res:any) => {
      this.verify_connectivity(type);
    }).catch((err) => {
      this.enable_blueetooth(type);
    });
  }

  verify_connectivity(type) {
    this.printer.connectivity().then((res: any) => {
      switch (type) {
        case "void":
          this.print_void();
          break;
        default:
          this.print_release();
          break;
      }
    }).catch((err) => {
      this.navCtrl.push('BluetoothPage');
    });
  }

  async print_void(){
    let separator = '-------------------------------';
    let header = '';
    let item = '';

    for(let counter = 0;counter < this.void_reports.length;counter++){
      item += `\n`+
              this.void_reports[counter].class +`\n`+
              this.void_reports[counter].quantity+` x `+this.void_reports[counter].size +` (`+this.void_reports[counter].type+`)\n`;
    }

    header = '        Vista del rio \n Carmen, Cagayan de Oro City';

    await this.printer.onWrite(header+'\n'+separator+'\nDaily Report (Void)\nDate: '+moment(this.search_date).format("MM/DD/YYYY")+'\n'+separator+'\n'+item+'\n'+separator+'\n\n\n');
  }

  async print_release(){
    let separator = '-------------------------------';
    let header = '';
    let item = '';

    for(let counter = 0;counter < this.release_reports.length;counter++){
      item += `\n`+
              this.release_reports[counter].class +`\n`+
              this.release_reports[counter].quantity+` x `+this.release_reports[counter].size +` (`+this.release_reports[counter].type+`)\n`;
    }

    header = '        Vista del rio \n Carmen, Cagayan de Oro City';

    await this.printer.onWrite(header+'\n'+separator+'\nDaily Report (Cleared)\nDate: '+moment(this.search_date).format("MM/DD/YYYY")+'\n'+separator+'\n'+item+'\n'+separator+'\n\n\n');
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
