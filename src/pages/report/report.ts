import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams,
         AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { ToastComponent } from '../../components/toast/toast';
import { PrinterProvider } from '../../providers/printer';
import { File } from '@ionic-native/file';
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

  selected_product: any = [];
  daily_report_from: any = moment().format('YYYY-MM-DD');
  daily_report_to: any = moment().format('YYYY-MM-DD');

  sales_report_date: any = moment().format('YYYY-MM-DD');

  isBusy: any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    public toast: ToastComponent,
    public alertCtrl: AlertController,
    private file: File,
    private printer: PrinterProvider) {
    this.getProduct();
  }

  ngOnInit() {
    switch (this.report_tab) {
      case "daily-report":
        this.release_reports = [];
        this.isBusy = false;
        this.release(this.selected_product);
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
        if(data.length > 0){
          switch (this.report_tab) {
            case "daily-report":
              this.selected_product = data;
              this.release_reports = [];
              this.isBusy = false;
              this.release(data);
              break;
            default:
              this.export(data);
              break;
          }
        }
      }
    });

    for(let index = 0;index < this.products.length;index++){
        await product.addInput({
          type: 'checkbox',
          label: this.products[index].name,
          value: this.products[index].id,
          checked: true
        });
    }

    product.present();
  }

  get_daily_report() {
    this.isBusy = false;
    this.provider.getData({ from : this.daily_report_from, to : this.daily_report_to },'report').then((res: any) => {
      if(res._data.status){
        this.reports = res._data.data;
      }
      this.isBusy = true;
    });
  }

  export(_product) {
    this.isBusy = false;
    this.provider.getData({ product : _product, from : this.daily_report_from, to : this.daily_report_to },'report/export').then((res: any) => {
      if(res._data.status && res._data.data.length > 0){
       this.generate(res._data.data);
      }else {
        this.toast.presentToast('Failed to export! No results found.');
      }
      this.isBusy = true;
    })
  }

  generate(_data){
    let csv: any = this.convertToCSV(_data)
      let fileName: any = "report.csv"
      this.file.writeFile(this.file.externalRootDirectory, fileName, csv, {})
        .then(
        _ => {
          this.toast.presentToast('Successfully Exported');
          }
        )
        .catch(
        err => {
          this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv)
          .then(
            _ => {
                this.toast.presentToast('Successfully Exported');
            }).catch(
              err => {
                this.toast.presentToast('Export Failed !');
              }
            )
       }
    )
  }

  convertToCSV(_data) {
    let csv: any = '';
    let header: any = '';

    let headers = Object.keys(_data[0]);
    for (let i = 0; i < headers.length; i++) {
      if (header != '') header += ';'
      header += headers[i];
    }
    csv += header + '\r\n';

    for (let j = 0; j < _data.length; j++) {
      let line = '';
      Object.keys(_data[j]).map(function(key) {
         line += _data[j][key] + ';';
      });

      csv += line + '\r\n';
    }

    return csv
  }
  
  release(_data) {
    this.provider.getData({ product : _data, date : this.sales_report_date, status : 'cleared' },'report/release').then((res:any) => {
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
