import { Component,
		     OnInit } from '@angular/core';
import { IonicPage,
		     NavController, 
		     NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage implements OnInit {

  user:any;
  cart:any = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider) 
  { 
  	this.user = JSON.parse(localStorage.getItem('_info'));
  }

  ngOnInit() {
    this.provider.getData({ status : 'cart', user : this.user.id },'get_transactions').then((res: any) => {
      if(res._data.status){
      	console.log("cart");
      	console.log(res._data.data);
      	this.cart = res._data.data;
      }
    });
  }

  check_out(id) {
  	this.provider.postData({ transaction : id, status : 'pending' },'update_transaction_status').then((res:any) => {
  		if(res._data.status){
  			this.ngOnInit();
  		}
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

}
