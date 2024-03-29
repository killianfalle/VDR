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
  warehouses:any = [];  
  warehouse:any = '';  
  daily_warehouse:any = ''; 

  csv_selected_product: any = [];
  selected_product: any = [];
  daily_report_from: any = moment().format('YYYY-MM-DD');
  daily_report_to: any = moment().format('YYYY-MM-DD');

  sales_report_date: any = moment().format('YYYY-MM-DD');

  isBusy: any = false;
  user_info: any;
  warehouse_staff_info: any;
  warehouse_info: any;
  warehouseName: any;
  warehouseAddress: any;
  warehouseID: any;
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
    this.getWarehouse();
    this.get_warehouse_info();
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

  get_warehouse_info(){
    this.user_info = JSON.parse(localStorage.getItem('_info'));
    console.log(this.user_info)

    if(this.user_info.type == 'warehouse_staff'){
      this.provider.getData({ id: this.user_info.id},'staff/single').then((res: any) => {
        if(res._data.status){
          this.warehouse_staff_info = res._data.data[0];
          this.provider.getData({warehouse_id: this.warehouse_staff_info.warehouse_info.warehouse_id}, 'get-warehouse').then((result: any) => {
            this.warehouse_info = result.warehouse[0];
            this.getWarehouseData(result.warehouse[0].name, result.warehouse[0].address, result.warehouse[0].id);
            console.log(this.warehouse_info)
          })
        }
        console.log(this.warehouse_staff_info)
      });
    }
   
  }

  getWarehouseData(name, address, id){
    this.warehouseName = name;
    this.warehouseAddress = address;
    this.warehouseID = id;
  }

  getProduct() {
    this.provider.getData('','product').then((res: any) => {
      if(res._data.status){
        this.products = res._data.data;
      }
    })
  }

  getWarehouse() {
    this.provider.getData('','get-warehouses').then((res: any) => {
      this.warehouses = res.warehouses;
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
              break;
            default:
              this.csv_selected_product = data;
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
        console.log('reports', this.reports)
      }
      this.isBusy = true;
    });

  }

  exportCSVCleared() {
    if(this.csv_selected_product.length > 0)
      this.export(this.csv_selected_product);
    else 
      this.toast.presentToast("Please select a product.");
  }

  exportCSVCancel() {
    if(this.csv_selected_product.length > 0){
      this.isBusy = false;
      this.provider.getData({ product : this.csv_selected_product, from : this.daily_report_from, to : this.daily_report_to },'report/export/cancelled').then((res: any) => {
        if(res._data.status && res._data.data.length > 0){
         this.generate(res._data.data);
        }else {
          this.toast.presentToast('Failed to export! No results found.');
        }
        this.isBusy = true;
      })
    }else {
      this.toast.presentToast("Please select a product.");
    }
  }

  export(_product) {
    this.isBusy = false;
    this.provider.getData({ product : _product, warehouse: this.warehouse, from : this.daily_report_from, to : this.daily_report_to },'report/export').then((res: any) => {
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

  daily_report() {
    if(this.selected_product.length > 0)
      this.ngOnInit();
    else 
      this.toast.presentToast("Please select a product.");
  }
  
  release(_data) {
    if(this.user_info.type == 'warehouse_staff'){
      console.log(this.warehouseID)
      this.daily_warehouse = this.warehouseID
    }
    this.provider.getData({ product : _data, warehouse: this.daily_warehouse, date : this.sales_report_date, status : 'cleared' },'report/release').then((res:any) => {
      if(res._data.status){
        this.release_reports = res._data.data;
        console.log(this.release_reports);
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
