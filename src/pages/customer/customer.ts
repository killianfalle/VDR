import { Component,
		     OnInit } from '@angular/core';
import { IonicPage, 
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
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
  result: any = 0;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider) 
  { }

  ngOnInit(self = this) {
    self.provider.getData('','get_customer').then((res: any) => {
        if(res._data.status){
          self.customers = res._data.data;
          self.result = res._data.result;
        }
    })
  }

  navigate() {
  	this.navCtrl.push('AddCustomerPage', {
      self : this,
      callback : this.ngOnInit
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerPage');
  }

}
