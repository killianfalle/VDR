import { Component } from '@angular/core';
import { App,
         IonicPage, 
         NavController, 
         NavParams } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';

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
  constructor(
  	public app: App, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public loader: LoaderComponent) {
    this.profile = JSON.parse(localStorage.getItem('_info'));
  }

  navigate() {
  	this.navCtrl.push('ChangePasswordPage');
  }

  logout() {
    localStorage.clear();

    setTimeout(() => {
  	  this.app.getRootNav().setRoot('LoginPage');
    },300);
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
