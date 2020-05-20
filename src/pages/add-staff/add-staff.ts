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

  info: any = {};
  _callback: any;
  error:any = {};
  warehouseList: any = [];

  keyword: any = '';
  offset:any = 0;
  limit:any = 500;
  result: any;
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
    this.provider.getData({ search : this.keyword, offset : this.offset, limit : this.limit },'staff').then((res: any) => {
      console.log(res._data.data)
      this.result = res._data.data.length
        if(res._data.status){
          this.info = {
            first_name: '',
            last_name: '',
            user_role: '',
            designated_warehouse: '',
            email: '',
            password: '',
            confirm_password: '',
            position: this.result
          }
        }
    });

    // console.log(this);
  }

  register() {
    console.log(this.info)
  	this.provider.postData(this.info,'register').then((res: any) => {
  		if(res._data.status){
  			console.log(res._data.message);
        this.toast.presentToast(res._data.message);
        this._callback(this.navParams.get('self'),true);
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
