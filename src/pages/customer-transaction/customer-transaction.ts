import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';

/**
 * Generated class for the CustomerTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-transaction',
  templateUrl: 'customer-transaction.html',
})
export class CustomerTransactionPage {

  customer:any;
  transactions: any = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
    public loader: LoaderComponent) {

  	this.customer = navParams.get('id');
  	this.get_transactions();
  }

  get_transactions() {
    this.provider.getData({ customer : this.customer },'customer/history').then((res: any) => {
      if(res._data.status)
        this.transactions = res._data.data;
    });
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }


}
