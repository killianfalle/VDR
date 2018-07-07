import { Component } from '@angular/core';
import { IonicPage,
		 NavController, 
		 NavParams } from 'ionic-angular';
import { Validators,
		 FormBuilder, 
		 FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  user: FormGroup;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
  	private form: FormBuilder) {

  	this.user = this.form.group({
      current: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

  change_password() {
  	this.provider.postData(this.user.value,'change_password').then((res: any) => {
  		if(res._data.status){
  			console.log(this.user.value);
  			this.navCtrl.pop();
  		}
  	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

}
