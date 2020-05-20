import { Component,
         ViewChild } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams,
         InfiniteScroll } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';

/**
 * Generated class for the CustomerTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-transaction',
  templateUrl: 'customer-transaction.html',
})
export class CustomerTransactionPage {

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  customer:any;
  transactions: any = [];

  offset:any = 0;
  limit:any = 10;

  isBusy:any = false;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
    public loader: LoaderComponent,
    public alert: AlertComponent) {

    this.customer = navParams.get('params');
    console.log(this.customer)
  	this.get_transactions();
  }

  get_transactions() {
    this.isBusy = false;
    this.provider.getData({ customer : this.customer.id, offset : this.offset, limit : this.limit },'customer/history').then((res: any) => {
      console.log(res);
      if(res._data.status){
        if(res._data.result > 0){
          this.offset += res._data.result;
          this.loadData(res._data.data);
        }else {
          this.stopInfinite();
        }
      }
      this.isBusy = true;
    });
  }

  loadData(_transaction) {
    _transaction.map(data => {
      this.transactions.push(data);
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.get_transactions();

      infiniteScroll.complete();
    }, 500);
  }

  stopInfinite(){
    this.infinite.enable(false);
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


}
