import { Component } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams } from 'ionic-angular';
import { Validators,
         FormBuilder, 
         FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider,
    private form: FormBuilder) {
    
    this.initForm();
  }

  initForm() {
    this.user = this.form.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  sign_in() {
    this.provider.postData(this.user.value,'login').then((res: any) => {
        if(res._data.status){
          localStorage.setItem('_info',JSON.stringify(res._data.info));
          localStorage.setItem('_token',res._data.token);

          setTimeout(() => {
  	        this.navCtrl.setRoot('TabsPage');
          },300)
        }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
