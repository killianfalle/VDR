import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { PrinterProvider } from '../../providers/printer';
import moment from 'moment';

/**
 * Generated class for the WarehousePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-warehouse',
  templateUrl: 'warehouse.html',
})
export class WarehousePage {

  releasing_transactions: any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: DataProvider,
    private printer: PrinterProvider) {
    this.get_transaction();
  }

  get_transaction() {
    this.provider.getData({ status : 'releasing' },'get_transactions').then((res: any) => {
      if(res._data.status)
          this.releasing_transactions = res._data.data;
    });
  }

 cleared_transaction(id) {
    this.provider.postData({ transaction : id, status : 'cleared' },'update_transaction_status').then((res:any) => {
      if(res._data.status){
        this.get_transaction();
      }
    })
  }

  verify_connectivity(_data) {
    this.printer.connectivity().then((res: any) => {
      this.ready_print(_data);
    }).catch((err) => {
      this.navCtrl.push('BluetoothPage');
    });
  }

  async ready_print(_data){
    let item = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += `\n`+
              _data.orders[counter].class +`\n`+
              _data.orders[counter].quantity +` x ` +_data.orders[counter].size +` (`+_data.orders[counter].type+`)\n`;
    }

    await this.printer.onWrite(`
      \nOwner: `+_data.first_name+`  `+_data.last_name +`
      \nRelease: `+moment(_data.release_at).format('MM/DD/YYYY')+`
      \n-------------------------------\n`+
         item + `
      \n-------------------------------
    \n`);

    this.cleared_transaction(_data.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WarehousePage');
  }

}
