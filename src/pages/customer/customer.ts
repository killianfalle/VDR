import { Component,
		     OnInit } from '@angular/core';
import { IonicPage, 
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';

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

  customers: any = [];

  keyword: any = '';

  result: any = 0;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider,
    public loader: LoaderComponent) 
  { }

  ngOnInit(self = this) {
    self.provider.getData({ search : self.keyword },'customer').then((res: any) => {
        if(res._data.status){
          self.customers = res._data.data;
          self.result = res._data.result;
        }
    })
  }

  navigate(page,type = null,_params = null) {
    let params = {};

    switch (type) {
      case "add":
        params = { self : this, callback : this.ngOnInit };
        this.navCtrl.push(page, params );
        break;
      case "history":
        params = { id : _params };
  	    this.navCtrl.push(page, params );
        break;
      default:
        break;
    }

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
