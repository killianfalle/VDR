import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators,
         FormBuilder, 
         FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';
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

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public provider: DataProvider,
  	public form: FormBuilder) {

    this._callback = navParams.get('callback');
  	this.initForm();
  }

  initForm() {
  	this.info = this.form.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      type: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

  register() {
  	this.provider.postData(this.info.value,'register').then((res: any) => {
  		if(res._data.status){
  			console.log(res._data.message);
        this._callback(this.navParams.get('self'));
  			this.navCtrl.pop();
  		}
  	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddStaffPage');
  }

}
