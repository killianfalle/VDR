import { Component,
		     OnInit } from '@angular/core';
import { IonicPage,
		     NavController, 
		     NavParams,
         Events,
         Keyboard } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { AlertComponent } from '../../components/alert/alert';
import { ToastComponent } from '../../components/toast/toast';
import { Socket } from 'ng-socket-io';

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

  keyword:any = '';

  isBusy:any = false;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private alert: AlertComponent,
    private toast: ToastComponent,
  	private provider: DataProvider,
    private event: Events,
    private keyboard: Keyboard,
    private socket: Socket) 
  { 
  	this.user = JSON.parse(localStorage.getItem('_info'));
  }

  ngOnInit() {
    this.isBusy = false;
    this.provider.getData({ status : 'in_cart', user : this.user.id, search: this.keyword },'cart').then((res: any) => {
      if(res._data.status){
        this.cart = res._data.data;
      }
      this.isBusy = true;
    });
  }

  edit(index,_data) {
    this.key = index;
    localStorage.setItem('cart_item',JSON.stringify(_data));
  }

  cancel_edit() {
    this.cart[this.key] = JSON.parse(localStorage.getItem('cart_item'));
    this.key = null;
    localStorage.removeItem('cart_item');
  }

  delete(row,i,_data) {
    this.alert.confirm('Remove Order').then((response: any) => {
      if(response){
        this.provider.postData({ root_id : this.cart[row].id, item_id : _data.id },'cart/delete').then((res:any) => {
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
              this.event.publish('notification:badge','decrement');
            }
          }
        });  
      }
    });
  }

  discard(row,_id) {
    this.alert.confirm('Discard Order').then((response: any) => {
      if(response){
        this.provider.postData({ transaction : _id, status : 'cancel' },'cart/discard').then((res:any) => {
          if(res._data.status){
            let root = this.cart.indexOf(this.cart[row]);

            if(root > -1){
              this.cart.splice(root, 1);
              this.toast.presentToast('Order successfully discarded');
              this.event.publish('notification:badge','decrement');
            }
          }
        });
      }
    });
  }

  quantity(index,subIndex,_add = true){
    if(_add){
      this.cart[index]['orders'][subIndex].quantity = parseInt(this.cart[index]['orders'][subIndex].quantity) + 1;
      this.cart[index].total_payment =  parseInt(this.cart[index].total_payment) + parseInt(this.cart[index]['orders'][subIndex].price);
      this.cart[index]['orders'][subIndex].total = parseInt(this.cart[index]['orders'][subIndex].total) + parseInt(this.cart[index]['orders'][subIndex].price);
    }
    else{
      if(parseInt(this.cart[index]['orders'][subIndex].quantity) - 1){
        this.cart[index]['orders'][subIndex].quantity = parseInt(this.cart[index]['orders'][subIndex].quantity) - 1;
        this.cart[index].total_payment = parseInt(this.cart[index].total_payment) - parseInt(this.cart[index]['orders'][subIndex].price);
        this.cart[index]['orders'][subIndex].total = parseInt(this.cart[index]['orders'][subIndex].total) - parseInt(this.cart[index]['orders'][subIndex].price);
      }
    }
  }

  update(_data) {
    this.alert.confirm('Save Changes').then((response:any) => {
      if(response){
        this.provider.postData({ data : _data },'cart/update').then((res:any) => {
          if(res._data.status){
            this.key = null;
            localStorage.removeItem('cart_item');
            this.toast.presentToast(res._data.message);
          }
        });
      }
    });
  }

  check_out(_data) {
    this.navCtrl.push('CheckoutCalendarPage',{ self: this, callback : this.checkout, data : _data });
  }

  checkout(_data,date,self) {
    self.provider.postData({ transaction : _data.id, release_at : date, status : 'pending' },'cart/status').then((res:any) => {
      if(res._data.status){
        self.ngOnInit();
        _data.release_at = date;
        _data.order_id = res._data.data.order_id;
        _data.payment_type = res._data.data.payment_type;
        _data.delivery_option = res._data.data.delivery_option;
        _data.status = 'pending';
        let params = { data : _data, type : 'add-pending-transaction' };
        self.socket.emit('transaction', { text: params });
        self.event.publish('notification:badge','decrement');
        self.toast.presentToast('Successfully checkout');
      }
    });
  }

  pressed() {  }

  active(index,subIndex,_add = true) {
    if(_add){
      this.cart[index]['orders'][subIndex].quantity = parseInt(this.cart[index]['orders'][subIndex].quantity) + 1;
      this.cart[index].total_payment =  parseInt(this.cart[index].total_payment) + parseInt(this.cart[index]['orders'][subIndex].price);
      this.cart[index]['orders'][subIndex].total = parseInt(this.cart[index]['orders'][subIndex].total) + parseInt(this.cart[index]['orders'][subIndex].price);
    }
    else{
      if(parseInt(this.cart[index]['orders'][subIndex].quantity) - 1){
        this.cart[index]['orders'][subIndex].quantity = parseInt(this.cart[index]['orders'][subIndex].quantity) - 1;
        this.cart[index].total_payment = parseInt(this.cart[index].total_payment) - parseInt(this.cart[index]['orders'][subIndex].price);
        this.cart[index]['orders'][subIndex].total = parseInt(this.cart[index]['orders'][subIndex].total) - parseInt(this.cart[index]['orders'][subIndex].price);
      }
    }
  }

  updateQty(index,subIndex,val) {
    console.log(val);
    if(this.cart[index]['orders'][subIndex].quantity > 0) {
      console.log(this.cart[index]['orders'][subIndex].quantity);
      this.cart[index]['orders'][subIndex].total = 0;
      this.cart[index].total_payment = 0;
      this.cart[index]['orders'][subIndex].total = (this.cart[index]['orders'][subIndex].quantity * parseInt(this.cart[index]['orders'][subIndex].price));
      this.cart[index].total_payment = parseInt(this.cart[index].total_payment) + parseInt(this.cart[index]['orders'][subIndex].total);
    }else if(parseInt(this.cart[index]['orders'][subIndex].quantity) === 0) {
      this.cart[index]['orders'][subIndex].quantity = 1;
      this.cart[index]['orders'][subIndex].total = 0;
      this.cart[index].total_payment = 0;
      this.cart[index]['orders'][subIndex].total = (this.cart[index]['orders'][subIndex].quantity * parseInt(this.cart[index]['orders'][subIndex].price));
      this.cart[index].total_payment = parseInt(this.cart[index].total_payment) + parseInt(this.cart[index]['orders'][subIndex].total);
    }
  }

  released() { }

  reset() {
    this.keyword = '';
    this.cart = [];
    this.ngOnInit();
  }

  search() {
    this.keyboard.close();
    this.cart = [];
    this.ngOnInit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

}
