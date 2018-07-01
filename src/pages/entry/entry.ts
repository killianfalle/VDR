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

  steps: any = 1;

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

  select_class(_class) {
    this.form.classification = _class;
    console.log(this.form);
  }

  select_size(_size) {
    this.form.size = _size;
    console.log(this.form);
  }

  backPage() {
    this.steps -= 1;
  }

  nextPage() {
    if(this.steps >= 1 || this.steps <= 4)
      this.steps += 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryPage');
  }

}
