import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  payments: any = [];

  keyword: any = '';

  result: any = 0;
  toggleReorder = 'Edit';
  isBusy: any = false;
  flag: any = false;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private provider: DataProvider,
    private alert: AlertComponent,
  	private toast: ToastComponent,
    public loader: LoaderComponent
  ) { }

  ngOnInit(self = this) {
    self.isBusy = false;
    self.provider.getData('','payment').then((res: any) => {
      console.log(res);
        if(res._data.status){
          self.payments = res._data.data;
          self.result = res._data.result;
        }
        self.isBusy = true;
    })
  }

  refresh(self = this, reload = false) {
    if(!reload){
      self.ngOnInit(self);
    }else {
      self.result = 0;
      self.payments = [];
      self.ngOnInit(self);
    }
  }

  navigate() {
    let params = { self : this, callback : this.refresh };
    this.navCtrl.push('AddPaymentPage', params );
  }

  on_edit(_data) {
    let params = { self : this, data : _data, callback : this.refresh };
    this.navCtrl.push('EditPaymentPage', params );
  }

  on_delete(_id) {
    this.alert.confirm().then((response:any) => {
      if(response) {
        this.delete(_id);
      }
    }).catch((error:any)=> {
      console.log(error);
    })
  }

  delete(_id) {
    this.provider.postData({ id: _id },'payment/hard-delete').then((res:any) => {
      if(res._data.status) {
        this.refresh();
        this.toast.presentToast(res._data.message);
      }
    })
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

  reorderItems(indexes){
    let element = this.payments[indexes.from];
    this.payments.splice(indexes.from, 1);
    this.payments.splice(indexes.to, 0, element);
  }

  reorderList(){
    if(this.toggleReorder == 'Edit'){
      this.toggleReorder = 'Done';
      this.flag = true;
    }else{
      this.toggleReorder = 'Edit';
      this.flag = false;
      console.log(this.payments);
      for(let i = 0; i < this.payments.length; i++){
        this.payments[i].position = i;
        console.log(this.payments[i])
        this.provider.postData(this.payments[i], 'payment/reorder', true).then((res:any) => {
          console.log(res)
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }

}
