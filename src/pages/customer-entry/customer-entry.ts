import { Component,
         OnInit,
         ViewChild } from '@angular/core';
import { IonicPage, 
		     NavController, 
		     NavParams,
         InfiniteScroll } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
/**
 * Generated class for the CustomerEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-entry',
  templateUrl: 'customer-entry.html',
})
export class CustomerEntryPage implements OnInit {

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  customers: any = [];
  keyword: any = '';
  key:any;

  offset:any = 0;
  limit:any = 20;

  isBusy:any = false;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
    public loader: LoaderComponent) {
  }

  ngOnInit(self = this) {
    self.isBusy = false;
    self.provider.getData({ search : self.keyword, offset : self.offset, limit : self.limit },'customer').then((res: any) => {
        if(res._data.status){
          if(res._data.result > 0){
            self.offset += res._data.result;
            self.loadData(res._data.data);
          }else {
            self.stopInfinite(self);
          }
        }
        self.isBusy = true;
    })
  }

  loadData(_customer) {
    _customer.map(data => {
      this.customers.push({ id: data.id, first_name : data.first_name, last_name : data.last_name });
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.ngOnInit();

      infiniteScroll.complete();
    }, 500);
  }

  stopInfinite(_self) {
    _self.infinite.enable(false);
  }

  navigate(_customer,_key) {
    this.key = _key;

    setTimeout(() => {
    	this.navCtrl.push('OrderEntryPage', {
        customer : _customer
      });
    },300)
  }

  reset() {
    this.offset = 0;
    this.keyword = '';
    this.customers = [];
    this.ngOnInit();
  }

  search() {
    this.offset = 0;
    this.customers = [];
    this.ngOnInit();
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
