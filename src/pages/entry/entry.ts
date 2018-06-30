import { Component } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams } from 'ionic-angular';

/**
 * Generated class for the EntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {

  form: any;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams
  ) {
  	this.initForm();
  }

  initForm() {
  	this.form = {
  		classification : null,
  		size: null
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryPage');
  }

}
