import { Component,
		 OnInit } from '@angular/core';
import { NavController,
		 Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';

/**
 * Generated class for the CartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'cart',
  templateUrl: 'cart.html'
})
export class CartComponent implements OnInit {

  badge: any = 0;

  constructor(
  	private navCtrl: NavController,
  	private event: Events,
  	private provider: DataProvider) {

    this.event.subscribe('notification:badge', () => {
    	this.ngOnInit();
    });
  }

  ngOnInit() {
  	this.provider.getData('','notification/total').then((res: any) => {
  		this.badge = res._data.result;
  	});
  }

  show_cart() {
  	this.navCtrl.push('CartPage');
  }

}
