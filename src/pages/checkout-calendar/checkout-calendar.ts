import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertComponent } from '../../components/alert/alert';
import { CalendarComponentOptions } from 'ion2-calendar';
import moment  from 'moment';
import { DataProvider } from '../../providers/data-provider';

/**
 * Generated class for the CheckoutCalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout-calendar',
  templateUrl: 'checkout-calendar.html',
})
export class CheckoutCalendarPage {

  date: any = moment().format('YYYY-MM-DD');

  option: CalendarComponentOptions = {
    color: 'danger'
  };

  _callback: any;
  params: any;
  self: any;
  user: any;
  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public dataProvider: DataProvider,
  	private alert: AlertComponent
  ) {
  	this.params = navParams.get('data');
  	this.self = navParams.get('self');
    this._callback = navParams.get('callback');
    
    console.log(this.params)
    console.log(this.self)
    console.log(this._callback)
  }

   action(submit = true) {
    let approval = 'pending'
  	this.user = JSON.parse(localStorage.getItem('_info'));

    if(submit){
      this.alert.confirm().then((response: any) => {
        if (response) {
          console.log(this.params)
          if(this.user.type == 'admin'){
            approval = 'approved'
          }
          this._callback(this.params,moment(this.date).format('YYYY-MM-DD'),this.self, this.navParams.get('warhouseID'), approval);
          this.dataProvider.CartToPending(this.params.order_id)
          // this.dataProvider.CartToPendingAdmin(this.params.order_id)
          this.navCtrl.pop();
        }
      });
    }else {
      this.navCtrl.pop();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutCalendarPage');
  }

}
