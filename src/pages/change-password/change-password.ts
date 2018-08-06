import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { Validators,
    		 FormBuilder, 
    		 FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
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

  profile: any;
  user: FormGroup;
  error: any = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: DataProvider,
    private form: FormBuilder,
    public loader: LoaderComponent) 
  {
    this.profile = JSON.parse(localStorage.getItem('_info'));

  	this.user = this.form.group({
      current_password: ['', Validators.required],
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
  	}).catch((error) => {
      console.log(error);
      let response = JSON.parse(error._body);
      console.log(response);
      this.error = response.error;
    });
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
