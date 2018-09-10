import { Component } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { PrinterProvider } from '../../providers/printer';
import { DecimalPipe } from '@angular/common';
import moment  from 'moment';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  profile: any;

  date: any = moment().format('YYYY-MM-DD');
  copies:any = 2;

  type: 'string';
  option: CalendarComponentOptions = {
    color: 'danger'
  };

  _callback: any;
  params: any;
  self: any;
  warehouseName: any;
  warehouseLocation: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    public decimal: DecimalPipe,
    private printer: PrinterProvider) {

    this.profile = JSON.parse(localStorage.getItem('_info'));
    this.params = navParams.get('data');
    this.self = navParams.get('self');
    this._callback = navParams.get('callback');
    this.params.printed_by = this.profile.first_name+' '+this.profile.last_name;
    this.params.printed_at = moment().format('MM/DD/YYYY');

    this.warehouseName = this.params.warehouse_designation.warehouse_info.name;
    this.warehouseLocation =  this.params.warehouse_designation.warehouse_info.address;
    console.log("NAME OF THE WAREHOUSE:");
    console.log(this.warehouseName);

    console.log("LOCATION OF THE WAREHOUSE:");
    console.log(this.warehouseLocation);
  }

  action(submit = true) {
    if(submit){
      // this.callback();
      this.alert.confirm().then((response: any) => {
        if (response) {
          this.printer.is_enabled().then((res: any) => {
            this.verify_connectivity();
          }).catch((err) => {
            this.enable_blueetooth();
          });
        }
      });
    }else {
      this.navCtrl.pop();
    }
  }

  enable_blueetooth() {
    this.printer.set_enable().then((res:any) => {
      this.verify_connectivity();
    }).catch((err) => {
      this.enable_blueetooth();
    });
  }

  verify_connectivity() {
    this.printer.connectivity().then((res: any) => {
      this.ready_print(this.params);
    }).catch((err) => {
      this.navCtrl.push('BluetoothPage');
    });
  }

  ready_print(_data){
    let separator = '-------------------------------\n';
    let header = '';
    let item = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += _data.orders[counter].class +'\n'+_data.orders[counter].size; 

      if(_data.orders[counter].type == null){
        item += '\n'+this.decimal.transform(_data.orders[counter].quantity,'1.0-0')+' x P'+this.decimal.transform(_data.orders[counter].price,'1.2-2')+' = P'+this.decimal.transform(_data.orders[counter].total,'1.2-2')+'\n';
      }else{
        item += '('+_data.orders[counter].type+')\n'+this.decimal.transform(_data.orders[counter].quantity,'1.0-0')+' x P'+this.decimal.transform(_data.orders[counter].price,'1.2-2')+' = P'+this.decimal.transform(_data.orders[counter].total,'1.2-2')+'\n';
      }

      if((counter+1) < _data.orders.length){
        item += '\n';
      }
    }

    // header =   '        Vista del rio \n Carmen, Cagayan de Oro City';
    //header =   '        '+ this.warehouseName + ' \n ' +  this.warehouseLocation;
    header =   '        Vista Del Rio \nWH: ' +  this.warehouseLocation;

    let content = header+'\n'+separator+'Order#: '+_data.order_id+'\nPrinted by: '+this.params.printed_by+'\nPrinted on: '+this.params.printed_at+'\n'+separator+'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(this.date).format("MM/DD/YYYY")+'\n'+separator+item+separator+'Total: P'+ this.decimal.transform(_data.total_payment,'1.2-2')+'\n'+separator+'Payment: '+_data.payment_type+'\nDelivery: '+_data.delivery_option+'\n\n\n';
    this.print_for_release(content);
    
    for(let count = 1;count < this.copies; count++){
      this.alert.confirm_print().then((res:any) => {
        if(res){
          this.print_for_release(content);
          if((count+1) == this.copies)
            this.callback();
        }
      });
    }
  }

  async print_for_release(_data) {
    await this.printer.onWrite(_data);
  }

  callback() {
    this._callback(this.params,moment(this.date).format('YYYY-MM-DD'),this.self);
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
