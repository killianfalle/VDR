import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
/**
 * Generated class for the TransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {

  tabs: any = 'finish';

  finish_transactions: any = [];
  pending_transactions: any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: DataProvider) {
  	this.get_transaction();
  }

  get_transaction() {
    this.provider.getData({ status : this.tabs },'get_transactions').then((res: any) => {
      if(res._data.status)
        switch (this.tabs) {
          case "pending":
            this.pending_transactions = res._data.data;
            break;
          default:
            this.finish_transactions = res._data.data;
            break;
        }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionPage');
  }

}
