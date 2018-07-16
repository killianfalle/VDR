import { Component } from '@angular/core';
import { IonicPage,
		 NavController, 
		 NavParams } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';
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

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public loader: LoaderComponent) {
  	this.data = navParams.get('data');
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
