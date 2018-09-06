import { Component } from '@angular/core';
import { IonicPage,
		 NavController, 
		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Generated class for the EditPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-payment',
  templateUrl: 'edit-payment.html',
})
export class EditPaymentPage {

  _callback: any;
  origin: any;
  payment:any;

  error:any = {};

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public provider: DataProvider,
  	public loader: LoaderComponent,
  	public toast: ToastComponent
  ) {
  	this.payment = this.navParams.get('data');
  	this._callback = navParams.get('callback');
  	this.origin = navParams.get('self');
  }

  update() {
  	this.provider.postData(this.payment,'payment/update').then((res:any) => {
  		if(res._data.status){
  			this.toast.presentToast(res._data.message);
  			this._callback(this.origin,true);
  			this.navCtrl.pop();
  		}
  	}).catch((error) => {
      this.error = JSON.parse(error._body).error;
    });;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPaymentPage');
  }

}
