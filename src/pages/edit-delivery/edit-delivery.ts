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
  selector: 'page-edit-delivery',
  templateUrl: 'edit-delivery.html',
})
export class EditDeliveryPage {

  _callback: any;
  origin: any;
  delivery:any;

  error:any = {};

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public provider: DataProvider,
  	public loader: LoaderComponent,
  	public toast: ToastComponent
  ) {
  	this.delivery = this.navParams.get('data');
  	this._callback = navParams.get('callback');
    this.origin = navParams.get('self');
    
    console.log(this.delivery)
  }

  update() {
  	this.provider.postData(this.delivery,'delivery/update').then((res:any) => {
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
  }

}
