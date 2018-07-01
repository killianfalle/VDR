import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staff',
  templateUrl: 'staff.html',
})
export class StaffPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  navigate() {
  	this.navCtrl.push('AddStaffPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffPage');
  }

}
