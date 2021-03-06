import { Component } from '@angular/core';
import { IonicPage,
		 NavController, 
		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';
/**
 * Generated class for the EditCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-customer',
  templateUrl: 'edit-customer.html',
})
export class EditCustomerPage {

  _callback: any;
  origin: any;
  customer:any;
  error:any = {};

  payment_types = [];
  delivery_options = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public provider: DataProvider,
  	public loader: LoaderComponent,
  	public toast: ToastComponent
  ) {
  	this.customer = this.navParams.get('data');
  	this._callback = navParams.get('callback');
  	this.origin = navParams.get('self');
    this.get_option();

    console.log(this.customer)
  }

  get_option() {
    this.provider.getData('','option/all').then((res:any) => {
      if(res._data.status) {
        console.log(res._data.data.payment)
        this.payment_types = res._data.data.payment;
        this.delivery_options = res._data.data.delivery;
      }
    })
  }

  update() {
    console.log(this.customer)
  	this.provider.postData(this.customer,'customer/update').then((res:any) => {
  		if(res._data.status){
  			this.toast.presentToast(res._data.message);
  			this._callback(this.origin,true);
  			this.navCtrl.pop();
  		}
  	}).catch((error) => {
      this.error = JSON.parse(error._body).error;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditCustomerPage');
  }

}
