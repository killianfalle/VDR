import { Component,
         OnInit } from '@angular/core';
import { IonicPage, 
		     NavController, 
		     NavParams } from 'ionic-angular';
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

  customers: any = [];
  keyword: any = '';
  result: any = 0;
  key:any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
    public loader: LoaderComponent) {
  }

  ngOnInit(self = this) {
    self.provider.getData({ search : this.keyword },'customer').then((res: any) => {
        if(res._data.status){
          self.customers = res._data.data;
          self.result = res._data.result;
        }
    })
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
    this.keyword = '';
    this.ngOnInit();
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
