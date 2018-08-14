import { Component,
         ViewChild } from '@angular/core';
import { IonicPage,
         NavController, 
         ModalController, 
         NavParams,
         Events,
         Keyboard,
         InfiniteScroll } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { ToastComponent } from '../../components/toast/toast';
import { PrinterProvider } from '../../providers/printer';
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

  @ViewChild(InfiniteScroll) infinite_releasing: InfiniteScroll;
  @ViewChild(InfiniteScroll) infinite_pending: InfiniteScroll;

  profile: any;

  tabs: any = 'cleared';
  search_date: any = moment().format('YYYY-MM-DD');

  cleared_transactions: any = [];
  releasing_transactions: any = [];
  pending_transactions: any = [];

  cleared_result = 0;
  releasing_result = 0;
  pending_result = 0;

  offset:any = 0;
  offset_pending:any = 0;
  offset_releasing:any = 0;
  limit:any = 10;

  keyword:any = '';

  isBusy:any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loader: LoaderComponent,
    public modalCtrl: ModalController,
    public alert: AlertComponent,
    public toast: ToastComponent,
    private provider: DataProvider,
    private event: Events,
    private keyboard: Keyboard,
    private printer: PrinterProvider,
    private socket: Socket) {
    this.profile = JSON.parse(localStorage.getItem('_info'));

  	this.get_transaction();

    this.add_pending_transaction().subscribe((_data) => {
      this.pending_result += 1;
      if(this.keyword == ''){
        this.pending_transactions.unshift(_data);
        this.offset_pending += 1;
      }
    });

    this.remove_pending_transaction().subscribe((_data) => {
      if(this.pending_result != 0)
        this.pending_result -= 1;

      let index = this.pending_transactions.map(obj => obj.id).indexOf(_data);
      if(index > -1){
        this.pending_transactions.splice(index, 1);
        if(this.offset_pending != 0)
          this.offset_pending -= 1;
      }  
    });

    this.add_releasing_transaction().subscribe((_data:any) => {
      this.releasing_result += 1;
      if(this.keyword == ''){
        this.releasing_transactions.push(_data);
        this.offset_releasing += 1;
      }
    });

    this.set_void_releasing_transaction().subscribe((_data:any) => {
      let index = this.releasing_transactions.map(obj => obj.id).indexOf(_data.id);
      if(index > -1){
        this.releasing_transactions[index].void = 1;
        this.releasing_transactions[index].void_reason = _data.reason;
      }
    });

    this.remove_releasing_transaction().subscribe((_data) => {
      if(this.releasing_result != 0)
        this.releasing_result -= 1;

      let index = this.releasing_transactions.map(obj => obj.id).indexOf(_data);
      if(index > -1){
        this.releasing_transactions.splice(index, 1);
        if(this.offset_releasing != 0)
          this.offset_releasing -= 1;
      }  
    });

    this.add_cleared_transaction().subscribe((_data:any) => {
      this.cleared_result += 1;
      if(this.search_date == _data.release_at){
        this.cleared_transactions.push(_data);
      }
    });

    this.set_void_cleared_transaction().subscribe((_data:any) => {
      let index = this.cleared_transactions.map(obj => obj.id).indexOf(_data.id);
      if(index > -1){
        this.cleared_transactions[index].void = 1;
        this.cleared_transactions[index].void_reason = _data.reason;
      }  
    });

    this.event.subscribe('transaction:release', (_data,date) => {
      this.provider.postData(_data,'notification/transaction-release').then((res:any) => {
        console.log(res);
      });
    });
  }

  get_transaction() {
    switch (this.tabs) {
      case "cleared":
        this.offset = 0;
        this.offset_releasing = 0;
        this.offset_pending = 0;
        this.pending_transactions = [];
        this.releasing_transactions = [];
        this.cleared_transactions = [];
        break;
      case "releasing":
        this.offset = this.offset_releasing;
        break;
      case "pending":
        this.offset = this.offset_pending;
        break;
      default:
        break;
    }
    
    this.isBusy = false;

    this.provider.getData({ status : this.tabs , date : this.search_date, search: this.keyword, offset : this.offset, limit : this.limit },'transaction').then((res: any) => {
      if(res._data.status){
        switch (this.tabs) {
          case "pending":
            if(res._data.status){
              if(res._data.result > 0){
                this.offset_pending += res._data.result;
                this.loadData_pending(res._data.data);
              }else {
                this.stopInfinite();
              }
            }
            break;
          case "releasing":
            if(res._data.status){
              if(res._data.result > 0){
                this.offset_releasing += res._data.result;
                this.loadData_releasing(res._data.data);
              }else {
                this.stopInfinite();
              }
            }
            break;
          default:
            this.cleared_transactions = res._data.data;
            this.cleared_result = res._data.result;
            break;
        }
      }
      this.isBusy = true;
    });
  }

  loadData_pending(_transaction) {
    _transaction.map(data => {
      this.pending_transactions.push(data);
    });
  }

  loadData_releasing(_transaction) {
    _transaction.map(data => {
      this.releasing_transactions.push(data);
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.get_transaction();

      infiniteScroll.complete();
    }, 500);
  }

  stopInfinite(){
    switch (this.tabs) {
      case "releasing":
        this.infinite_releasing.enable(false);
        break;
      default:
        this.infinite_pending.enable(false);
        break;
    }
  }

  enableInfinite() {
    switch (this.tabs) {
      case "releasing":
        this.infinite_releasing.enable(true);
        break;
      default:
        this.infinite_pending.enable(true);
        break;
    }
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

  show_calendar(_data) {
    this.navCtrl.push('CalendarPage', {
      data : _data,
      self : this,
      callback : this.releasing_transaction
    })
  }

  releasing_transaction(_data,date,self) {
    self.provider.postData({ transaction : _data, date : date , status : 'releasing' },'transaction/status').then((res:any) => {
      if(res._data.status){
        self.remove_pending(_data,self);
        self.add_releasing(_data,date,self);
        self.event.publish('transaction:release', _data, date);
        self.toast.presentToast(res._data.message);
      }
    })
  }

  remove_pending(_data,self){
    let params = { data : _data.id, type : 'remove-pending-transaction' };
    self.socket.emit('transaction', { text: params });
  }

  add_releasing(_data,date,self){
    _data.status = 'releasing';
    _data.release_at = date;
    let params = { data : _data, type : 'add-releasing-transaction' };
    self.socket.emit('transaction', { text: params });
  }

  void_transaction(id,type = 'cleared') {
    let void_form = this.modalCtrl.create('VoidFormPage',{});

    void_form.onDidDismiss(data => {
     if(data != null){
       this.provider.postData({ transaction : id , reason : data },'transaction/void').then((res:any) => {
         if(res._data.status){
           let params = {};

           switch (type) {
             case "releasing":
               params = { data : id, reason : data, type : 'set-void-releasing-transaction' };
               this.socket.emit('transaction', { text: params });
               break;
             case "cleared":
               params = { data : id, reason : data, type : 'set-void-cleared-transaction' };
               this.socket.emit('transaction', { text: params });
               break;
             default:
               break;
           }
         }
       });
     }
   });

    void_form.present();
  }

  cancel_transaction(_data) {
    this.alert.confirm('Cancel Transaction').then((response: any) => {
      if(response){
        this.provider.postData({ transaction : _data, status : 'cancel' },'transaction/status').then((res:any) => {
          if(res._data.status){
            this.remove_pending(_data,this);
            this.toast.presentToast('Successfully cancelled transaction');
          }
        });
      }
    });
  }

  edit_transaction(row,_data) {
    this.alert.confirm('Edit Transaction').then((response: any) => {
      if(response){
        this.loader.show_loader('processing');
        this.provider.postData({ transaction : _data, status : 'in_cart' },'transaction/status').then((res:any) => {
          if(res._data.status){
            let root = this.pending_transactions.indexOf(this.pending_transactions[row]);

            if(root > -1){
              this.pending_transactions.splice(root, 1);
              this.remove_pending(_data,this);
              this.event.publish('notification:badge','increment');
              this.pending_result -= 1;
            }
            this.loader.hide_loader();
          }
        });
      }
    });
  }

  reprint(_data) {
    this.alert.confirm('Re-print').then((response: any) => {
      if (response) {
        this.printer.is_enabled().then((res: any) => {
          this.verify_connectivity(_data);
        }).catch((err) => {
          this.enable_blueetooth(_data);
        });
      }
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
      this.do_reprint(_data);
    }).catch((err) => {
      this.navCtrl.push('BluetoothPage');
    });
  }

  async do_reprint(_data){
    let separator = '-------------------------------\n';
    let header = '';
    let item = '';
    let content = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += _data.orders[counter].class +'\n'+_data.orders[counter].size; 

      if(_data.orders[counter].type == null){
        item += '\n'+_data.orders[counter].quantity +' x P'+_data.orders[counter].price+' = P'+_data.orders[counter].total+'\n';
      }else{
        item += '('+_data.orders[counter].type+')\n'+_data.orders[counter].quantity +' x P'+_data.orders[counter].price+' = P'+_data.orders[counter].total+'\n';
      }

      if((counter+1) < _data.orders.length){
        item += '\n';
      }
    }

    header = '        Vista del rio \n Carmen, Cagayan de Oro City';

    if(_data.void){
      content = header+'\n'+separator+'Order#: '+_data.order_id+'\nPrinted by: '+_data.printed_by+'\nPrinted on: '+_data.printed_at+'\n'+separator+'Owner: '+_data.first_name+'  '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\nRemarks: Void\n'+separator+item+separator+'Total : P'+_data.total_payment+'\n\n\n';
    }else {
      content = header+'\n'+separator+'Order#: '+_data.order_id+'\nPrinted by: '+_data.printed_by+'\nPrinted on: '+_data.printed_at+'\n'+separator+'Owner: '+_data.first_name+'  '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\n'+separator+item+separator+'Total : P'+_data.total_payment+'\n\n\n';
    }

    await this.printer.onWrite(content);
  }

  reset() {
    this.keyword = '';
    this.offset_pending = 0;
    this.offset_releasing = 0;
    this.pending_transactions = [];
    this.releasing_transactions = [];
    this.enableInfinite();
    this.get_transaction();
  }

  search() {
    this.keyboard.close();
    this.offset_pending = 0;
    this.offset_releasing = 0;
    this.pending_transactions = [];
    this.releasing_transactions = [];
    this.enableInfinite();
    this.get_transaction();
  }

  read_reason(msg) {
    this.alert.show_dialog('Reason',msg);
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

  ionViewCanEnter() {
    this.provider.getData({ date : this.search_date },'transaction/badge').then((res:any) => {
      if(res._data.status){
        this.cleared_result = res._data.result.cleared;
        this.releasing_result = res._data.result.releasing;
        this.pending_result = res._data.result.pending;
      }
    })
  }

}
