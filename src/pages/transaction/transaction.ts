import { Component } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams,
         Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
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
  search_date: any = '';

  cleared_transactions: any = [];
  releasing_transactions: any = [];
  pending_transactions: any = [];

  isBusy:any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    private provider: DataProvider,
    private event: Events,
    private socket: Socket) {
  	this.get_transaction();

    this.add_pending_transaction().subscribe((_data) => {
      this.pending_transactions.push(_data);
    });

    this.remove_pending_transaction().subscribe((_data) => {
      let index = this.pending_transactions.map(obj => obj.id).indexOf(_data);
      if(index > -1){
        this.pending_transactions.splice(index, 1);
      }  
    });

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

    this.add_cleared_transaction().subscribe((_data) => {
      this.cleared_transactions.push(_data);
    });

    this.set_void_cleared_transaction().subscribe((_data) => {
      let index = this.cleared_transactions.map(obj => obj.id).indexOf(_data);
      console.log(index);
      this.cleared_transactions[index].void = 1;
    });

    this.event.subscribe('transaction:release', (_data,date) => {
      this.provider.postData(_data,'notification/transaction-release').then((res:any) => {
        console.log(res);
        _data.status = 'releasing';
        _data.release_at = date;
        let params = { data : _data, type : 'add-releasing-transaction' };
        this.socket.emit('transaction', { text: params });
      });
    });
  }

  get_transaction() {
    switch (this.tabs) {
      case "pending":
        this.pending_transactions = [];
        break;
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
      this.isBusy = true;
    });
  }

  add_cleared_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('add-cleared-transaction', (data) => {
        observer.next(data.data);
      });
    })
    return observable;
  }

  add_pending_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('add-pending-transaction', (data) => {
        observer.next(data.data);
      });
    })
    return observable;
  }

  add_releasing_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('add-releasing-transaction', (data) => {
        observer.next(data.data);
      });
    })
    return observable;
  }

  remove_pending_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('remove-pending-transaction', (data) => {
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

  set_void_cleared_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('set-void-cleared-transaction', (data) => {
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

  show_calendar(_data) {
    this.navCtrl.push('CalendarPage', {
      data : _data,
      self : this,
      callback : this.releasing_transaction
    })
  }

  releasing_transaction(_data,date,self) {
    self.provider.postData({ transaction : _data.id, date : date, status : 'releasing' },'transaction/status').then((res:any) => {
      if(res._data.status){
        self.get_transaction();

        let params = { data : _data.id, type : 'remove-pending-transaction' };
        self.socket.emit('transaction', { text: params });

        self.event.publish('transaction:release', _data, date);
      }
    })
  }

  void_transaction(id,type = 'cleared') {
    this.alert.confirm().then((response:any) => {
      if (response) {
        this.provider.postData({ transaction : id },'transaction/void').then((res:any) => {
          if(res._data.status){
            this.get_transaction();

            let params = {};

            switch (type) {
              case "releasing":
                params = { data : id, type : 'set-void-releasing-transaction' };
                this.socket.emit('transaction', { text: params });
                break;
              case "cleared":
                params = { data : id, type : 'set-void-cleared-transaction' };
                this.socket.emit('transaction', { text: params });
                break;
              default:
                break;
            }
          }
        });
      }
    });
  }

  cancel_transaction(_data) {
    this.alert.confirm().then((response: any) => {
      if(response){
        this.provider.postData({ transaction : _data.id, status : 'cancel' },'transaction/status').then((res:any) => {
          if(res._data.status){
            this.get_transaction();
            let params = { data : _data.id, type : 'remove-pending-transaction' };
            this.socket.emit('transaction', { text: params });
          }
        });
      }
    });
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
