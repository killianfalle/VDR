import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { Validators,
         FormBuilder, 
         FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Generated class for the AddPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-delivery',
  templateUrl: 'add-delivery.html',
})
export class AddDeliveryPage {

	delivery: any = {};
	_callback: any;
	origin: any;
	error:any = {};
  result:any;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public loader: LoaderComponent,
    public toast: ToastComponent,
  	private provider: DataProvider,
    private form: FormBuilder) {

    this._callback = navParams.get('callback');
    this.origin = navParams.get('self');
    this.initForm();
  }

  initForm() {

    this.provider.getData('','option/all').then((res: any) => {
      console.log(res);
      this.result = res._data.data.delivery.length
        if(res._data.status){
          this.delivery = {
            name: null,
            position: this.result
          }
        }
    })
  }

  save() {
    console.log(this.delivery)
    this.provider.postData(this.delivery, 'delivery/add').then((res: any) => {
      console.log(res._data.message);
      this.toast.presentToast(res._data.message);
      this._callback(this.origin,true);
      this.navCtrl.pop();
    }).catch((error) => {
      this.error = JSON.parse(error._body).error;
    });
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }
}
