import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { PrinterProvider } from '../../providers/printer';
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

  date: any = moment().format('YYYY-MM-DD');
  type: 'string';
  option: CalendarComponentOptions = {
  	color: 'danger'
  };

  _callback: any;
  params: any;
  self: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    private printer: PrinterProvider) {

  	this.params = navParams.get('data');
  	this.self = navParams.get('self');
  	this._callback = navParams.get('callback');
  }

  action(submit = true) {
  	if(submit){
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

  async ready_print(_data){
    let item = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += `\n`+
              _data.orders[counter].class +`\n`+
              _data.orders[counter].size +` (`+_data.orders[counter].type+`)\n`+
              _data.orders[counter].quantity +` x `+_data.orders[counter].price+`\n`;
    }

    for(let count = 0;count < 2;count++){
      await this.printer.onWrite(`
        \n         Vista del rio         \n   
        Cagayan De Oro City    
        \n-------------------------------
        \nOrder#: `+ _data.order_id +`
        \nOwner: `+_data.first_name+`  `+_data.last_name +`
        \nRelease: `+moment(this.date).format('MM/DD/YYYY')+`
        \n-------------------------------\n`+
           item + `
        \n-------------------------------
        \nTotal : P`+ _data.total_payment +`
      \n`)
    }

    this.callback();
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
