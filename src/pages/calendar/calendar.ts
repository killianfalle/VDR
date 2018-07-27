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

  profile: any;

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

    this.profile = JSON.parse(localStorage.getItem('_info'));
    this.params = navParams.get('data');
    this.self = navParams.get('self');
    this._callback = navParams.get('callback');
    this.params.printed_by = this.profile.first_name+' '+this.profile.last_name;
    this.params.printed_at = moment().format('MM/DD/YYYY');
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
    let separator = '-------------------------------';
    let header = '';
    let item = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += `\n`+
              _data.orders[counter].class +`\n`+
              _data.orders[counter].size +` (`+_data.orders[counter].type+`)\n`+
              _data.orders[counter].quantity +` x P`+_data.orders[counter].price+`\n`;
    }

    header = '        Vista del rio \n Carmen, Cagayan de Oro City';

    for(let count = 0;count < 2;count++){
      await this.printer.onWrite(header+'\n'+separator+'\nOrder#: '+_data.order_id+'\nPrinted by: '+this.params.printed_by+'\nPrinted on: '+this.params.printed_at+'\n'+separator+'\nOwner: '+_data.first_name+'  '+_data.last_name+'\nRelease: '+moment(this.date).format("MM/DD/YYYY")+'\n'+separator+'\n'+item+'\n'+separator+'\nTotal : P'+_data.total_payment+'\n\n\n');
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
