import { Component,
         OnInit } from '@angular/core';
import { IonicPage, 
		     NavController, 
		     NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
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
  result: any = 0;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private provider: DataProvider) {
  }

  ngOnInit(self = this) {
    self.provider.getData('','get_customer').then((res: any) => {
        if(res._data.status){
          self.customers = res._data.data;
          self.result = res._data.result;
        }
    })
  }

  navigate(_customer) {
  	this.navCtrl.push('OrderEntryPage', {
      customer : _customer
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerEntryPage');
  }

}
