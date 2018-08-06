import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams,
         AlertController } from 'ionic-angular';
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

  report_tab: any = 'csv-report';

  reports:any = [];  
  release_reports:any = [];  
  products:any = [];  

  selected_product: any = '';
  daily_report_from: any = moment().format('YYYY-MM-DD');
  daily_report_to: any = moment().format('YYYY-MM-DD');

  sales_report_date: any = moment().format('YYYY-MM-DD');

  isBusy: any = false;

  public options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Order #','First Name','Last Name','Void','Product','Class','Size','Qty_Type','Qty','Price','Total','Release Date'],
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
    public alertCtrl: AlertController,
    private printer: PrinterProvider) {
    this.getProduct();
  }

  ngOnInit() {
    switch (this.report_tab) {
      case "daily-report":
        this.release_reports = [];
        this.isBusy = false;
        this.release();
        break;
      default:
        this.get_daily_report();
        break;
    }
  }

  getProduct() {
    this.provider.getData('','product').then((res: any) => {
      if(res._data.status){
        this.products = res._data.data;
      }
    })
  }

  async show_product(){
    let product = this.alertCtrl.create();

    product.setTitle('Select Product');

    product.addButton('Cancel');
    product.addButton({
      text: 'OK',
      handler: data => {
        if(data != undefined){
          this.export(data);
        }
      }
    });

    for(let index = 0;index < this.products.length;index++){
        await product.addInput({
          type: 'radio',
          label: this.products[index].name,
          value: this.products[index].id,
          checked: false
        });
    }

    product.present();
  }

  get_daily_report() {
    this.isBusy = false;
    this.provider.getData({ product : this.selected_product, from : this.daily_report_from, to : this.daily_report_to },'report').then((res: any) => {
      if(res._data.status){
        this.reports = res._data.data;
      }
      this.isBusy = true;
    });
  }

  export(_product) {
    this.isBusy = false;
    this.provider.getData({ product : _product, from : this.daily_report_from, to : this.daily_report_to },'report/export').then((res: any) => {
      if(res._data.status){
       this.generate(res._data.data);
      }
      this.isBusy = true;
    })
  }

  generate(_data){
    new Angular2Csv(_data,'Report', this.options);
  }
  
  release() {
    this.provider.getData({ product : this.selected_product, date : this.sales_report_date, status : 'cleared' },'report/release').then((res:any) => {
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
      this.enable_bluetooth(type);
    });
  }

  enable_bluetooth(type) {
    this.printer.set_enable().then((res:any) => {
      this.verify_connectivity(type);
    }).catch((err) => {
      this.enable_bluetooth(type);
    });
  }

  verify_connectivity(type) {
    this.printer.connectivity().then((res: any) => {
      this.print_release();
    }).catch((err) => {
      this.navCtrl.push('BluetoothPage');
    });
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

    await this.printer.onWrite(header+'\n'+separator+'\nDaily Report (Cleared)\nDate: '+moment(this.sales_report_date).format("MM/DD/YYYY")+'\n'+separator+'\n'+item+'\n'+separator+'\n\n\n');
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
