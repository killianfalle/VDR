import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReviewEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review-entry',
  templateUrl: 'review-entry.html',
})
export class ReviewEntryPage {

  data: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.data = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewEntryPage');
  }

}
