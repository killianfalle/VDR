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
 * Generated class for the AddCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-customer',
  templateUrl: 'add-customer.html',
})
export class AddCustomerPage {

  customer: FormGroup;
  _callback: any;
  origin: any;
  error:any = {};

  payment_types = [];
  delivery_options = [];

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
    this.get_option();
  }

  initForm() {
    this.customer = this.form.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      location: ['', Validators.required],
      payment_type: ['', Validators.required],
      delivery_option: ['', Validators.required],
    });
    this.customer.get('payment_type').setValue(1);
  }

  get_option() {
    this.provider.getData('','option/all').then((res:any) => {
      if(res._data.status) {
        this.payment_types = res._data.data.payment;
        console.log(this.payment_types[1])
        this.delivery_options = res._data.data.delivery;
      }
    })
  }

  register() {
    this.provider.postData(this.customer.value,'customer/register').then((res: any) => {
      if(res._data.status){
        console.log(res._data.message);
        this.toast.presentToast(res._data.message);
        this._callback(this.origin,true);
        this.navCtrl.pop();
      }
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
