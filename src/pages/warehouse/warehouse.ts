import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';
import { DataProvider } from '../../providers/data-provider';
import { PrinterProvider } from '../../providers/printer';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
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

  profile:any;
  releasing_transactions: any = [];

  isBusy:any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loader: LoaderComponent,
    private provider: DataProvider,
    private printer: PrinterProvider,
    private socket: Socket) {
    this.profile = JSON.parse(localStorage.getItem('_info'));
    this.get_transaction();

    this.add_releasing_transaction().subscribe((_data) => {
      this.releasing_transactions.push(_data);
    });

    this.set_void_releasing_transaction().subscribe((_data) => {
      let index = this.releasing_transactions.map(obj => obj.id).indexOf(_data);
      this.releasing_transactions[index].void = 1;
    });

    this.remove_releasing_transaction().subscribe((_data) => {
      let index = this.releasing_transactions.map(obj => obj.id).indexOf(_data);
      if(index > -1){
        this.releasing_transactions.splice(index, 1);
      }  
    });
  }

  get_transaction() {
    this.isBusy = false;
    this.provider.getData({ status : 'releasing' },'transaction').then((res: any) => {
      if(res._data.status)
          this.releasing_transactions = res._data.data;
      this.isBusy = true;
    });
  }

  add_releasing_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('add-releasing-transaction', (data) => {
        observer.next(data.data);
      });
    })
    return observable;
  }

  set_void_releasing_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('set-void-releasing-transaction', (data) => {
        observer.next(data.data);
      });
    })
    return observable;
  }

  remove_releasing_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('remove-releasing-transaction', (data) => {
        observer.next(data.data);
      });
    })
    return observable;
  }

  cleared_transaction(_data) {
    this.provider.postData({ transaction : _data.id, status : 'cleared' },'transaction/status').then((res:any) => {
      if(res._data.status){
        this.get_transaction();

        let params = { data : _data.id, type : 'remove-releasing-transaction' };
        this.socket.emit('transaction', { text: params });

        _data.status = 'cleared';
        params = { data : _data, type : 'add-cleared-transaction' };
        this.socket.emit('transaction', { text: params });
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

    this.cleared_transaction(_data);
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
