import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the CartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'logo',
  templateUrl: 'logo.html'
})
export class LogoComponent {

  constructor(private navCtrl: NavController) {
    console.log('Hello CartComponent Component');
  }

  show_cart() {
  	this.navCtrl.push('CartPage');
  }

}
