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
  }

  update() {
  	this.provider.postData(this.staff,'staff/update').then((res:any) => {
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
    console.log('ionViewDidLoad EditStaffPage');
  }

}
