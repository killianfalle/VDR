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

  ready_print(_data){
    let separator = '-------------------------------\n';
    let header = '';
    let item = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += _data.orders[counter].class +'\n'+_data.orders[counter].size; 

      if(_data.orders[counter].type == null){
        item += '\n'+_data.orders[counter].quantity +' x P'+_data.orders[counter].price+' = P'+ _data.orders[counter].total+'\n';
      }else{
        item += '('+_data.orders[counter].type+')\n'+_data.orders[counter].quantity +' x P'+_data.orders[counter].price+' = P'+ _data.orders[counter].total+'\n';
      }

      if((counter+1) < _data.orders.length){
        item += '\n';
      }
    }

    header = '        Vista del rio \n Carmen, Cagayan de Oro City';

    let content = header+'\n'+separator+'Order#: '+_data.order_id+'\nPrinted by: '+this.params.printed_by+'\nPrinted on: '+this.params.printed_at+'\n'+separator+'Owner: '+_data.first_name+'  '+_data.last_name+'\nRelease: '+moment(this.date).format("MM/DD/YYYY")+'\n'+separator+item+separator+'Total : P'+_data.total_payment+'\n\n\n';

    this.print_for_release(content);

    this.alert.confirm_print().then((res:any) => {
      if(res){
        this.print_for_release(content);
        this.callback();
      }
    })
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
