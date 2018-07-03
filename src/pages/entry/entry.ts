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
  class_key: any = null;

  steps: any = 1;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams
  ) {
  	this.initForm();
  }

  initForm() {
  	this.form = {
  		class : null,
  		size: null,
      qty_type: null,
      qty: null,
      total: null,
      release_date: null,
      current_date: new Date().toISOString()
  	}
  }

  select_class(_class,_key = null) {
    this.form.class = _class;
    this.class_key = _key;
    console.log(this.form);
  }

  select_size(_size) {
    if(_size == 'SS' || _size == 'Crack 3' || _size == 'Crack 1/2')
      _size = this.class_key +' '+_size;

    this.form.size = _size;
    console.log(this.form);
  }

  select_qty(_qty) {
    this.form.qty_type = _qty;
    console.log(this.form);
  }

  onPage(page = 'next') {
    if(page == 'next')
      this.steps += 1;
    else
      this.steps -= 1;
  }

  preview(){
    this.navCtrl.push('ReviewEntryPage', { data : this.form });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryPage');
  }

}
