import { Component } from '@angular/core';
import { IonicPage,
		 NavController, 
		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  products: any = [];

  keyword: any = null;

  result: any = 0;

  isBusy: any = false;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
    public loader: LoaderComponent) 
  { }

  ngOnInit(self = this) {
    self.isBusy = false;
    self.provider.getData({ search : self.keyword },'product').then((res: any) => {
        if(res._data.status){
          self.products = res._data.data;
          self.result = res._data.result;
        }
        self.isBusy = true;
    })
  }

  navigate(page) {
    let params = { self : this, callback : this.ngOnInit };
    this.navCtrl.push(page, params );
  }

  view_info(_info) {
    this.navCtrl.push('ProductInfoPage',{ info : _info });
  }

  reset() {
    this.keyword = null;
    this.products = [];
    this.ngOnInit();
  }

  search() {
    this.products = [];
    this.ngOnInit();
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }
}
