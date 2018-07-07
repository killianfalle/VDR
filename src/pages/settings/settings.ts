import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(
  	public app: App, 
  	public navCtrl: NavController, 
  	public navParams: NavParams) {
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
    console.log('ionViewDidLoad SettingsPage');
  }

}
