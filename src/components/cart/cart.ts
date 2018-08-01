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

    this.event.subscribe('notification:badge', (action,value = null) => {
    	switch (action) {
        case "increment":
          this.badge = parseInt(this.badge) + 1;
          break;
        case "decrement":
          this.badge = parseInt(this.badge) - 1;
          break;
        default:
          this.badge = value;
          break;
      }

      localStorage.setItem('badge',this.badge);
    });
  }

  ngOnInit() {
    if(localStorage.getItem('badge') != null)
		  this.badge = localStorage.getItem('badge');
    else
      this.badge = 0;
  }

  show_cart() {
  	this.navCtrl.push('CartPage');
  }

}
