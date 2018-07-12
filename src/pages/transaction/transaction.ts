import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { PrinterProvider } from '../../providers/printer';
import moment from 'moment';

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
    private provider: DataProvider,
    private printer: PrinterProvider) {
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

  show_calendar(id) {
    this.navCtrl.push('CalendarPage', {
      id : id,
      self : this,
      callback : this.releasing_transaction
    })
  }

  releasing_transaction(id,date,self) {
    self.provider.postData({ transaction : id, date : date, status : 'releasing' },'update_transaction_status').then((res:any) => {
      if(res._data.status){
        self.get_transaction();
      }
    })
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

  verify_connectivity(_data) {
    this.printer.connectivity().then((res: any) => {
      this.ready_print(_data);
    }).catch((err) => {
      console.log("printer not found");
    });
  }

  ready_print(_data){
    let item = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += `\n`+
              _data.orders[counter].class +`\n`+
              _data.orders[counter].size +` (`+_data.orders[counter].type+`)\n`+
              _data.orders[counter].quantity +` x `+_data.orders[counter].price+`\n`;
    }

    this.printer.onWrite(`
      \nOwner: `+_data.first_name+`  `+_data.last_name +`
      \nRelease: `+moment(_data.release_at).format('MM/DD/YYYY')+`
      \n-------------------------------\n`+
         item + `
      \n-------------------------------
      \nTotal : P`+ _data.total_payment +`
    \n`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionPage');
  }

}
