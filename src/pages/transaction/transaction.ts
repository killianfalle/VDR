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

  tabs: any = 'cleared';

  cleared_transactions: any = [];
  releasing_transactions: any = [];
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
          case "releasing":
            this.releasing_transactions = res._data.data;
            break;
          default:
            this.cleared_transactions = res._data.data;
            break;
        }
    });
  }

  void_transaction(id) {
    this.provider.postData({ transaction : id },'set_void_transaction').then((res:any) => {
      if(res._data.status){
        this.get_transaction();
      }
    })
  }

  cancel_transaction(id) {
    this.provider.postData({ transaction : id, status : 'cancel' },'update_transaction_status').then((res:any) => {
      if(res._data.status){
        this.get_transaction();
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionPage');
  }

}
