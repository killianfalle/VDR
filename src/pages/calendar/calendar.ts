import { Component } from '@angular/core';
import { IonicPage,
		 NavController, 
		 NavParams } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';
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
  	public navParams: NavParams) {

  	this.params = navParams.get('id');
  	this.self = navParams.get('self');
  	this._callback = navParams.get('callback');
  }

  action(submit = true) {
  	if(submit){
  		this._callback(this.params,moment(this.date).format('YYYY-MM-DD'),this.self);
  		this.navCtrl.pop();
  	}else {
  		this.navCtrl.pop();
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }

}
