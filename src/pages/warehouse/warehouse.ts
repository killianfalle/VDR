import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
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
  receiver:any;
  search_date: any = moment().format('YYYY-MM-DD');
  
  releasing_transactions: any = [];
  cleared_transactions: any = [];

  releasing_result: any = 0;
  cleared_result: any = 0;

  isBusy:any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    private provider: DataProvider,
    private printer: PrinterProvider,
    private socket: Socket) {
    this.profile = JSON.parse(localStorage.getItem('_info'));

    this.get_transaction();

    this.add_releasing_transaction().subscribe((_data:any) => {
      this.releasing_result += 1;
      if(this.search_date == _data.release_at){
        this.releasing_transactions.push(_data);
      }
    });

    this.set_void_releasing_transaction().subscribe((_data:any) => {
      let index = this.releasing_transactions.map(obj => obj.id).indexOf(_data.id);
      this.releasing_transactions[index].void = 1;
      this.releasing_transactions[index].void_reason = _data.reason;
    });

    this.set_void_cleared_transaction().subscribe((_data:any) => {
      let index = this.cleared_transactions.map(obj => obj.id).indexOf(_data.id);
      if(index > -1){
        this.cleared_transactions[index].void = 1;
        this.cleared_transactions[index].void_reason = _data.reason;
      }  
    });

    this.remove_releasing_transaction().subscribe((_data) => {
      let index = this.releasing_transactions.map(obj => obj.id).indexOf(_data);
      if(index > -1){
        this.releasing_transactions.splice(index, 1);
        this.releasing_result -= 1;
      }  
    });

    this.add_cleared_transaction().subscribe((_data:any) => {
      this.cleared_result += 1;
      if(this.search_date == _data.release_at){
        this.cleared_transactions.push(_data);
      }
    });
  }

  get_transaction() {
    switch (this.tabs) {
      case "releasing":
        this.releasing_transactions = [];
        break;
      default:
        this.receiver = null;
        this.cleared_transactions = [];
        break;
    }
    
    this.isBusy = false;

    this.provider.getData({ status : this.tabs , date : this.search_date },'transaction').then((res: any) => {
      if(res._data.status)
        switch (this.tabs) {
          case "releasing":
            this.releasing_transactions = res._data.data;
            this.releasing_result = res._data.result;
            break;
          default:
            this.cleared_transactions = res._data.data;
            this.cleared_result = res._data.result;
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
        observer.next({id : data.data, reason : data.reason});
      });
    })
    return observable;
  }

  set_void_cleared_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('set-void-cleared-transaction', (data) => {
        observer.next({id : data.data, reason : data.reason});
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

  add_cleared_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('add-cleared-transaction', (data) => {
        observer.next(data.data);
      });
    })
    return observable;
  }

  cleared_transaction(_data) {
    this.provider.postData({ transaction : _data, status : 'cleared' },'transaction/status').then((res:any) => {
      if(res._data.status){
        let params = { data : _data.id, type : 'remove-releasing-transaction' };
        this.socket.emit('transaction', { text: params });

        _data.status = 'cleared';
        params = { data : _data, type : 'add-cleared-transaction' };
        this.socket.emit('transaction', { text: params });
      }
    })
  }

  print(_data){
    this.alert.confirm('Release & Print').then((res:any) => {
      if(res){
        this.do_print(_data);
      }
    });
  }

  do_print(_data){
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
    console.log(_data);
    let separator = '-------------------------------\n';
    let header = '';
    let item = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += _data.orders[counter].class +'\n'+ _data.orders[counter].quantity;

      if (_data.orders[counter].type != null) {
       item += ' x ' +_data.orders[counter].size +'('+_data.orders[counter].type+') \n';
      }else {
        item += ' x ' +_data.orders[counter].size+'\n';
      }

      if((counter+1) < _data.orders.length){
        item += '\n';
      }
    }

    header = '        Vista del rio \n       Zayas Warehouse,\n     Cagayan de Oro City';

    let content = header+'\n'+ separator +'Order#: '+ _data.order_id +'\nReleased by: '+this.profile.first_name+' '+this.profile.last_name+'\n'+ separator +'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\n'+separator+item+separator+'\nReleased by:___________________\nReceived by:___________________\n\n\n\n';
    
    await this.printer.onWrite(content);
    this.cleared_transaction(_data);
  }

  read_reason(msg) {
    this.alert.show_dialog('Reason',msg);
  }

  ionViewCanEnter() {
    this.provider.getData({ date : this.search_date },'transaction/badge').then((res:any) => {
      if(res._data.status){
        this.cleared_result = res._data.result.cleared;
        this.releasing_result = res._data.result.releasing;
      }
    })
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
