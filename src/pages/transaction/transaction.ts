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
import { DecimalPipe } from '@angular/common';
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

  @ViewChild(InfiniteScroll) infinite_cleared: InfiniteScroll;
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
  offset_cleared:any = 0;
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
    private decimal: DecimalPipe,
    private socket: Socket) {
    this.profile = JSON.parse(localStorage.getItem('_info'));

    //this.enableInfinite();
  	this.get_transaction();

    this.add_pending_transaction().subscribe((_data) => {
      console.log(_data);
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

    this.remove_cleared_transaction().subscribe((_data) => {
      if(this.cleared_result != 0)
        this.cleared_result -= 1;

      let index = this.cleared_transactions.map(obj => obj.id).indexOf(_data);
      if(index > -1){
        this.cleared_transactions.splice(index, 1);
        if(this.offset_cleared != 0)
          this.offset_cleared -= 1;
      }  
    });

    this.add_cleared_transaction().subscribe((_data:any) => {
      if(this.search_date == _data.release_at){
        if(this.keyword == ''){
          this.cleared_result += 1;
          this.cleared_transactions.push(_data);
          this.offset_cleared += 1;
        }
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

  onChangeDate() {
    console.log("by date");
    this.offset_cleared = 0;
    this.cleared_transactions = [];
    this.enableInfinite();
    this.get_transaction();
  }

  get_transaction() {
    switch (this.tabs) {
      case "cleared":
        this.offset = this.offset_cleared;
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
            this.cleared_result = res._data.total;
            if(res._data.status){
              if(res._data.result > 0){
                this.offset_cleared += res._data.result;
                this.loadData_cleared(res._data.data);
              }else {
                this.stopInfinite();
              }
            }
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

  loadData_cleared(_transaction) {
    _transaction.map(data => {
      this.cleared_transactions.push(data);
    });
  }

  doInfinite(infiniteScroll) {
    console.log("trigger");
    setTimeout(() => {
      this.get_transaction();

      infiniteScroll.complete();
    }, 500);
  }

  stopInfinite(){
    switch (this.tabs) {
      case "cleared":
        this.infinite_cleared.enable(false);
        break;
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
      case "cleared":
        this.infinite_cleared.enable(true);
        break;
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

  remove_cleared_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('remove-cleared-transaction', (data) => {
        console.log(data);
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
        self.add_releasing(_data,date,self, res._data.staffIdList);
        self.event.publish('transaction:release', _data, date);
        self.toast.presentToast(res._data.message);
      }
    })
  }

  remove_pending(_data,self){
    let params = { data : _data.id, type : 'remove-pending-transaction' };
    self.socket.emit('transaction', { text: params });
  }

  add_releasing(_data,date,self, staffIDList){
    _data.status = 'releasing';
    _data.release_at = date;
    let params = { data : _data, type : 'add-releasing-transaction', 'staffIDList': staffIDList };
    self.socket.emit('transaction', { text: params });
  }

  void_transaction(id,type = 'cleared') {
    let void_form = this.modalCtrl.create('VoidFormPage',{});

    void_form.onDidDismiss(data => {
     if(data != null){
       this.provider.postData({ transaction: id , reason: data },'transaction/void').then((res:any) => {
         if(res._data.status){
           let params = {};

           switch (type) {
             case "releasing":
               params = { data: id, reason: data, type: 'set-void-releasing-transaction' };
               this.socket.emit('transaction', { text: params });
               break;
             case "cleared":
               params = { data: id, reason: data, type: 'set-void-cleared-transaction' };
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

  return_transaction(_data) {
    let void_form = this.modalCtrl.create('VoidFormPage',{});

    void_form.onDidDismiss(data => {
     if(data != null){
       this.provider.postData({ transaction:{ id: _data.id }, reason: data, status: 'return' },'transaction/return').then((res:any) => {
         if(res._data.status){
           console.log(res);
           let param = { data : _data.id, type : 'remove-cleared-transaction' };
           this.socket.emit('transaction', { text: param });

           let params = { data: _data, type: 'add-pending-transaction' };
           this.socket.emit('transaction', { text: params });
         }
       });
     }
   });

    void_form.present();
  }

  cancel_transaction(_data) {
    this.alert.confirm('Cancel Transaction').then((response: any) => {
      if(response){
        this.provider.postData({ transaction: _data, status: 'cancel' },'transaction/status').then((res:any) => {
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
        this.provider.postData({ transaction: _data, status: 'in_cart' },'transaction/status').then((res:any) => {
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
        item += '\n'+this.decimal.transform(_data.orders[counter].quantity,'1.0-0')+' x P'+this.decimal.transform(_data.orders[counter].price,'1.2-2')+' = P'+this.decimal.transform(_data.orders[counter].total,'1.2-2')+'\n';
      }else{
        item += '('+_data.orders[counter].type+')\n'+this.decimal.transform(_data.orders[counter].quantity,'1.0-0')+' x P'+this.decimal.transform(_data.orders[counter].price,'1.2-2')+' = P'+this.decimal.transform(_data.orders[counter].total,'1.2-2')+'\n';
      }

      if((counter+1) < _data.orders.length){
        item += '\n';
      }
    }

    header = '        Vista del rio \n Carmen, Cagayan de Oro City';

    if(_data.void){
      content = header+'\n'+separator+'Order#: '+_data.order_id+'\nPrinted by: '+_data.printed_by+'\nPrinted on: '+_data.printed_at+'\n'+separator+'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\nRemarks: Void\n'+separator+item+separator+'Total: P'+this.decimal.transform(_data.total_payment,'1.2-2')+'\n'+separator+'Payment: '+_data.payment_type+'\nDelivery: '+_data.delivery_option+'\n\n\n';
    }else {
      content = header+'\n'+separator+'Order#: '+_data.order_id+'\nPrinted by: '+_data.printed_by+'\nPrinted on: '+_data.printed_at+'\n'+separator+'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\n'+separator+item+separator+'Total: P'+this.decimal.transform(_data.total_payment,'1.2-2')+'\n'+separator+'Payment: '+_data.payment_type+'\nDelivery: '+_data.delivery_option+'\n\n\n';
    }

    await this.printer.onWrite(content);
  }

  reset() {
    this.keyword = '';
    this.searching();
  }

  search() {
    this.keyboard.close();
    this.searching();
  }

  searching(){
    this.offset_pending = 0;
    this.offset_releasing = 0;
    this.offset_cleared = 0;
    this.pending_transactions = [];
    this.releasing_transactions = [];
    this.cleared_transactions = [];
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
