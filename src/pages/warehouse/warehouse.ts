import { Component,
         ViewChild } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams,
         Keyboard,
         InfiniteScroll } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { ToastComponent } from '../../components/toast/toast';
import { DataProvider } from '../../providers/data-provider';
import { PrinterProvider } from '../../providers/printer';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { DecimalPipe } from '@angular/common';
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

  @ViewChild(InfiniteScroll) infinite_cleared: InfiniteScroll;
  @ViewChild(InfiniteScroll) infinite_releasing: InfiniteScroll;

  tabs: any = 'cleared';

  profile:any;
  search_date: any = moment().format('YYYY-MM-DD');
  
  releasing_transactions: any = [];
  cleared_transactions: any = [];

  releasing_result: any = 0;
  cleared_result: any = 0;

  offset:any = 0;
  offset_releasing:any = 0;
  offset_cleared:any = 0;
  limit:any = 10;

  keyword:any = '';

  isBusy:any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public keyboard: Keyboard,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    public toast: ToastComponent,
    private provider: DataProvider,
    private printer: PrinterProvider,
    private decimal: DecimalPipe,
    private socket: Socket) {
    this.profile = JSON.parse(localStorage.getItem('_info'));

    this.get_transaction();

    this.add_releasing_transaction().subscribe((_data:any) => {
      var userInfo = JSON.parse(localStorage.getItem('_info'));

      if(userInfo.type == 'warehouse_staff'){
        for(var counter = 0; counter < _data.staffIdList.length; counter++){
          if(_data.staffIdList[counter] == userInfo['id']){
            if(this.keyword == ''){
              this.releasing_result += 1;
              this.offset_releasing += 1;
              this.releasing_transactions.push(_data.data);
            }
            break;
          }
        }
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
      var userInfo = JSON.parse(localStorage.getItem('_info'));
      for(var counter = 0; counter < _data.staffList.length; counter++){
        if(_data.staffList[counter] == userInfo['id']){
          if(this.search_date == _data.release_at){
            if(this.keyword == ''){
              this.cleared_result += 1;
              this.offset_cleared += 1;
              this.cleared_transactions.push(_data);
            }
          }
          break;
        }
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
  }

  async get_transaction() {
    switch (this.tabs) {
      case "cleared":
        this.offset = this.offset_cleared;
        break;
      default:
        this.offset = this.offset_releasing
        break;
    }
    
    this.isBusy = false;

    await this.provider.getData({ status : this.tabs , date : this.search_date, search: this.keyword, offset : this.offset, limit : this.limit },'transaction').then((res: any) => {
      if(res._data.status)
        switch (this.tabs) {
          case "releasing":
            if(res._data.result > 0){
              this.offset_releasing += res._data.result;
              this.releasing_result = this.offset;
              this.load_releasing(res._data.data);
            }else {
              this.stopInfinite();
            }
            break;
          default:
            if(res._data.result > 0){
              this.offset_cleared += res._data.result;
              this.releasing_result = this.offset;
              this.load_cleared(res._data.data);
            }else {
              this.stopInfinite();
            }
            break;
        }
      this.isBusy = true;
    });
  }

  load_releasing(_transaction) {
    _transaction.map(data => {
      this.releasing_transactions.push(data);
    });
  }

  load_cleared(_transaction) {
    _transaction.map(data => {
      this.cleared_transactions.push(data);
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
      case "cleared":
        this.infinite_cleared.enable(false);
        break;
      default:
        this.infinite_releasing.enable(false);
        break;
    }
  }

  enableInfinite() {
    switch (this.tabs) {
      case "cleared":
        this.infinite_cleared.enable(true);
        break;
      default:
        this.infinite_releasing.enable(true);
        break;
    }
  }

  add_releasing_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('add-releasing-transaction', (data) => {
        observer.next(data);
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
        observer.next(data.data);
      });
    })
    return observable;
  }

  add_cleared_transaction() {
    let observable = new Observable(observer => {
      this.socket.on('add-cleared-transaction', (data) => {
        observer.next(data);
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
        let staff_List = res._data.staffIdList;
        // params = { data : _data, type : 'add-cleared-transaction',  : staff_List };
        var anotherParams = [];
        anotherParams['data'] = _data;
        anotherParams['type'] = 'add-cleared-transaction';
        anotherParams['staffList'] = staff_List;
        this.socket.emit('transaction', { text: anotherParams });

        this.toast.presentToast('Successfully released transaction');
      }
    })
  }

  print(title,_data,reprint = false,ps = false){
    // this.cleared_transaction(_data);
    this.alert.confirm(title).then((res:any) => {
      if(res){
        this.do_print(_data,reprint,ps);
      }
    });
  }

  do_print(_data,_reprint,_ps){
    this.printer.is_enabled().then((res: any) => {
      this.verify_connectivity(_data,_reprint,_ps);
    }).catch((err) => {
      this.enable_blueetooth(_data,_reprint,_ps);
    });
  }

  enable_blueetooth(_data,_reprint,_ps) {
    this.printer.set_enable().then((res:any) => {
      this.verify_connectivity(_data,_reprint,_ps);
    }).catch((err) => {
      this.enable_blueetooth(_data,_reprint,_ps);
    });
  }

  verify_connectivity(_data,_reprint,_ps) {
    this.printer.connectivity().then((res: any) => {
      if(!_reprint){
        this.ready_print(_data);
      }else{
        this.reprint(_data,_ps);
      }
    }).catch((err) => {
      this.navCtrl.push('BluetoothPage');
    });
  }

  async ready_print(_data){
    let separator = '-------------------------------\n';
    let header = '';
    let item = '';
    let content = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += _data.orders[counter].class +'\n'+this.decimal.transform(_data.orders[counter].quantity,'1.0-0');

      if (_data.orders[counter].type != null) {
       item += ' x ' +_data.orders[counter].size +'('+_data.orders[counter].type+') \n';
      }else {
        item += ' x ' +_data.orders[counter].size+'\n';
      }

      if((counter+1) < _data.orders.length){
        item += '\n';
      }
    }

    header = '        Vista del rio \n'+ _data.warehouse_designation.warehouse_info.address;

    if(_data.void){
      content = header+'\n'+ separator +'Order#: '+ _data.order_id +'\nReleased by: '+this.profile.first_name+' '+this.profile.last_name+'\n'+ separator +'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\nRemarks: Void\n'+separator+item+separator+"Payment: "+_data.payment_type+"\nDelivery: "+_data.delivery_option+'\n'+separator+'Items received above are \ntrue & correct.\n\nReceived by:\n______________________________\n(Customer printed name)\n\nContact#:\n______________________________\n\n\n';
    }else {
      content = header+'\n'+ separator +'Order#: '+ _data.order_id +'\nReleased by: '+this.profile.first_name+' '+this.profile.last_name+'\n'+ separator +'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\n'+separator+item+separator+"Payment: "+_data.payment_type+"\nDelivery: "+_data.delivery_option+'\n'+separator+'Items received above are \ntrue & correct.\n\nReceived by:\n______________________________\n(Customer printed name)\n\nContact#:\n______________________________\n\n\n';
    }

    await this.printer.onWrite(content);
    this.cleared_transaction(_data);
  }

  async reprint(_data,_ps){
    let separator = '-------------------------------\n';
    let header = '';
    let item = '';
    let content = '';

    for(let counter = 0;counter < _data.orders.length;counter++){
      item += _data.orders[counter].class +'\n'+this.decimal.transform(_data.orders[counter].quantity,'1.0-0');

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

    if(_ps){
      content = header+'\n'+ separator +'Order#: '+ _data.order_id +'\nReleased by: '+this.profile.first_name+' '+this.profile.last_name+'\n'+ separator +'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\nRemarks: Packing Slip\n'+separator+item+separator+"Payment: "+_data.payment_type+"\nDelivery: "+_data.delivery_option+'\n'+separator+'\n\n\n';
    }else {
      if(_data.void){
        content = header+'\n'+ separator +'Order#: '+ _data.order_id +'\nReleased by: '+this.profile.first_name+' '+this.profile.last_name+'\n'+ separator +'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\nRemarks: Void\n'+separator+item+separator+"Payment: "+_data.payment_type+"\nDelivery: "+_data.delivery_option+'\n'+separator+'Items received above are \ntrue & correct.\n\nReceived by:\n______________________________\n(Customer printed name)\n\nContact#:\n______________________________\n\n\n';
      }else {
        content = header+'\n'+ separator +'Order#: '+ _data.order_id +'\nReleased by: '+this.profile.first_name+' '+this.profile.last_name+'\n'+ separator +'Owner: '+_data.first_name+' '+_data.last_name+'\nRelease: '+moment(_data.release_at).format("MM/DD/YYYY")+'\n'+separator+item+separator+"Payment: "+_data.payment_type+"\nDelivery: "+_data.delivery_option+'\n'+separator+'Items received above are \ntrue & correct.\n\nReceived by:\n______________________________\n(Customer printed name)\n\nContact#:\n______________________________\n\n\n';
      }
    }

    await this.printer.onWrite(content);
  }

  read_reason(msg) {
    this.alert.show_dialog('Reason',msg);
  }

  reset() {
    this.keyword = '';
    this.searching();
  }

  search() {
    this.keyboard.close();
    this.searching();
  }

  searching() {
    this.offset = 0;
    this.offset_cleared = 0;
    this.offset_releasing = 0;
    this.releasing_transactions = [];
    this.cleared_transactions = [];
    this.enableInfinite();
    this.get_transaction();
  }

  ionViewCanEnter() {
    //this.provider.getData({ date : this.search_date },'transaction/badge').then((res:any) => {
    this.provider.getData('','transaction/badge').then((res:any) => {
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