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

  tabs: any = 'cleared';

  profile:any;
  search_date: any = '';
  
  releasing_transactions: any = [];
  cleared_transactions: any = [];

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
    switch (this.tabs) {
      case "releasing":
        this.releasing_transactions = [];
        break;
      default:
        this.cleared_transactions = [];
        break;
    }
    
    this.isBusy = false;

    this.provider.getData({ status : this.tabs , date : this.search_date },'transaction').then((res: any) => {
      if(res._data.status)
        switch (this.tabs) {
          case "releasing":
            this.releasing_transactions = res._data.data;
            break;
          default:
            this.cleared_transactions = res._data.data;
            break;
        }
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

  print(_data){
    this.printer.is_enabled().then((res: any) => {
      this.verify_connectivity(_data);
    }).catch((err) => {
      this.enable_blueetooth(_data);
    });
  }

  enable_blueetooth(_data) {
    this.printer.set_enable().then((res:any) => {
      this.verify_connectivity(_data);
    }).catch((err) => {
      this.enable_blueetooth(_data);
    });
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
      \n         Vista del rio         \n   
      Cagayan De Oro City    
      \n-------------------------------
      \nOrder#: `+ _data.order_id +`
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
