import { Component } from '@angular/core';
import { App,
         IonicPage, 
         NavController, 
         NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { OneSignal } from '@ionic-native/onesignal';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  profile:any;
  device:any;

  constructor(
  	public app: App, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public provider: DataProvider,
    public oneSignal: OneSignal,
    public loader: LoaderComponent) {
    this.profile = JSON.parse(localStorage.getItem('_info'));
    this.device = localStorage.getItem('_device');
  }

  navigate() {
  	this.navCtrl.push('ChangePasswordPage');
  }

  logout() {
    this.provider.postData({ token : this.device } , 'device/unregister').then((res: any) => {
      localStorage.clear();
      this.oneSignal.sendTags({session: 'logged_out'});
  	  this.app.getRootNav().setRoot('LoginPage', { logout : true, email : this.profile.email });
    });
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
