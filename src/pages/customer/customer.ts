import { Component,
		     OnInit,
         ViewChild } from '@angular/core';
import { IonicPage, 
    		 NavController, 
         NavParams,
    		 Keyboard,
         InfiniteScroll } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';
import { AlertComponent } from '../../components/alert/alert';

/**
 * Generated class for the CustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  customers: any = [];

  keyword: any = '';

  offset:any = 0;
  limit:any = 20;

  isBusy: any = false;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
  	private keyboard: Keyboard,
  	private provider: DataProvider,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    public toast: ToastComponent,
  ) 
  { }

  ngOnInit(self = this) {
    self.isBusy = false;
    self.provider.getData({ search : self.keyword, offset : self.offset, limit : self.limit },'customer').then((res: any) => {
      console.log(res);
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
      this.customers.push(data);
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.ngOnInit();

      infiniteScroll.complete();
    }, 500);
  }

  stopInfinite(_self){
    _self.infinite.enable(false);
  }

  navigate(page,type = null,_params = null) {
    let params = {};

    switch (type) {
      case "add":
        params = { self : this, callback : this.refresh };
        this.navCtrl.push(page, params );
        break;
      case "history":
        params = { params : _params };
  	    this.navCtrl.push(page, params );
        break;
      default:
        break;
    }
  }

  refresh(self = this, reload = false) {
    if(!reload){
      self.ngOnInit(self);
    }else {
      self.offset = 0;
      self.customers = [];
      self.ngOnInit(self);
    }
  }

  on_edit(_data) {
    let params = { self : this, callback : this.refresh, data : _data };
    console.log(params)
    this.navCtrl.push('EditCustomerPage', params );
  }

  remove(_data) {
    this.alert.confirm('Delete Customer').then((response:any) => {
      if(response){
        this.loader.show_loader('processing');
        this.provider.postData({ id : _data.id },'customer/delete').then((res:any) => {
          if(res._data.status){
            this.loader.hide_loader();
            this.toast.presentToast(res._data.message);
            this.refresh(this,true);
          }
        })
      }
    })
  }

  restore(_data) {
    this.alert.confirm('Restore Customer').then((response:any) => {
      if(response){
        this.loader.show_loader('processing');
        this.provider.postData({ id : _data.id },'customer/restore').then((res:any) => {
          if(res._data.status){
            this.loader.hide_loader();
            this.toast.presentToast(res._data.message);
            this.refresh(this,true);
          }
        })
      }
    })
  }

  reset() {
    this.keyword = '';
    this.offset = 0;
    this.customers = [];
    this.ngOnInit();
  }

  search() {
    this.keyboard.close();
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
