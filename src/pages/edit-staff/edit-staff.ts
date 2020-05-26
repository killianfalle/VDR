import { Component } from '@angular/core';
import { IonicPage,
		 NavController, 
		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Generated class for the EditStaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-staff',
  templateUrl: 'edit-staff.html',
})
export class EditStaffPage {
 
  _callback: any;
  origin: any;
  staff:any;
  error:any = {};
  warehouseList: any = [];
  designated_warehouse: any;
  toggleChange = 'add'
  info: any;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public provider: DataProvider,
  	public loader: LoaderComponent,
  	public toast: ToastComponent
  ) {
  	this.staff = this.navParams.get('data');

    console.log("STAFF INFORMATION:");
    console.log(this.staff);
  	this._callback = navParams.get('callback');
  	this.origin = navParams.get('self');

    this.warehouseList = navParams.get('warehouseList');
    console.log(this.warehouseList)
  }

  update() {
    if(this.staff.user_role != 'warehouse_staff'){
      this.designated_warehouse = 0;
    }
    this.staff.designated_warehouse = this.designated_warehouse
    console.log(this.staff)
  	this.provider.postData(this.staff,'staff/update').then((res:any) => {
  		if(res._data.status){
  			this.toast.presentToast(res._data.message);
  			this._callback(this.origin,true);
  			this.navCtrl.pop();
  		}
  	}).catch((error) => {
      this.error = JSON.parse(error._body).error;
    });
  }

  toggleChangingPassword(){
    console.log('toggle change password')
    if(this.toggleChange == 'add'){
      this.toggleChange = 'remove';
    }else{
      this.toggleChange = 'add';
    }

    console.log(this.toggleChange)
  }

  changePassword(){
    console.log(this.staff)
    this.provider.postData(this.staff, 'change_staff_password').then((res:any) => {
      this.toast.presentToast('Successfully Changed Password');
      this.staff.password = '';
      this.staff.current_password = '';
      this.staff.confirm_password = '';
      this.error = {};
  	}).catch((error) => {
      this.error = JSON.parse(error._body).error;
      console.log(this.error)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditStaffPage');
  }

}
