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

  key:any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider) 
  { 
  	this.user = JSON.parse(localStorage.getItem('_info'));
  }

  edit(index = null) {
    this.key = index;      
  }

  delete(row,i,_data) {
    this.provider.postData({ root_id : this.cart[row].id, item_id : _data.id },'delete_item').then((res:any) => {
      if(res._data.status){
        let index = this.cart[row]['orders'].indexOf(_data);
         
        if(index > -1){
          this.cart[row]['orders'].splice(index, 1);
        }

        if(this.cart[row]['orders'].length == 0){
          let root = this.cart.indexOf(this.cart[row]);

          if(root > -1){
            this.cart.splice(root, 1);
          }
        }
      }
    })  
  }

  quantity(index,subIndex,_add = true){
    if(_add)
      this.cart[index]['orders'][subIndex].quantity = parseInt(this.cart[index]['orders'][subIndex].quantity) + 1;
    else
      this.cart[index]['orders'][subIndex].quantity = parseInt(this.cart[index]['orders'][subIndex].quantity) - 1;
  }

  update(_data) {
    this.provider.postData({ data : _data },'update_item_quantity').then((res:any) => {
      if(res._data.status){
        this.key = null;
      }
    })
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
