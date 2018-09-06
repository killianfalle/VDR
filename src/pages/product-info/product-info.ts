import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProductInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-info',
  templateUrl: 'product-info.html',
})
export class ProductInfoPage {
  
  product:any = {};

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams
  ) {
  	this.product = this.navParams.get('info');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductInfoPage');
  }

}
