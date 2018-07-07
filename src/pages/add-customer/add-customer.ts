import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { Validators,
         FormBuilder, 
         FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';

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

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
    private form: FormBuilder) {

    this._callback = navParams.get('callback');
    this.initForm();
  }

  initForm() {
    this.customer = this.form.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
  }

  register() {
    this.provider.postData(this.customer.value,'register/customer').then((res: any) => {
      if(res._data.status){
        console.log(res._data.message);
        this._callback(this.navParams.get('self'));
        this.navCtrl.pop();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCustomerPage');
  }

}
