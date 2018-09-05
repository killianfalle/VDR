import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators,
         FormBuilder, 
         FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Generated class for the AddStaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-staff',
  templateUrl: 'add-staff.html',
})
export class AddStaffPage {

  info: FormGroup;
  _callback: any;
  error:any = {};
  warehouseList: any = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public loader: LoaderComponent,
    public toast: ToastComponent,
  	public provider: DataProvider,
  	public form: FormBuilder) {

    this._callback = navParams.get('callback');

    this.warehouseList = navParams.get('warehouseList');
    console.log(this.warehouseList);
  	this.initForm();
  }

  initForm() {
  	this.info = this.form.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      user_role: ['', Validators.required],
      designated_warehouse: [''],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });


    // console.log(this);
  }

  register() {
  	this.provider.postData(this.info.value,'register').then((res: any) => {
  		if(res._data.status){
  			console.log(res._data.message);
        this.toast.presentToast(res._data.message);
        this._callback(this.navParams.get('self'));
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
