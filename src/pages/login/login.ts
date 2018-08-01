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
    private form: FormBuilder,
    public toast: ToastComponent,
    public loader: LoaderComponent) {
    
    this.initForm();
  }

  initForm() {
    this.user = this.form.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  sign_in() {
    this.loader.show_loader('auth');

    this.provider.postData(this.user.value,'login').then((res: any) => {
        if(res._data.status){
          localStorage.setItem('_info',JSON.stringify(res._data.info));
          localStorage.setItem('_token',res._data.token);

          setTimeout(() => {
  	        this.navCtrl.setRoot('TabsPage');
          },300);

          this.loader.hide_loader();
        }
    }).catch((error) => {
      this.toast.presentToast(JSON.parse(error._body).error.message);
      this.loader.hide_loader();
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
