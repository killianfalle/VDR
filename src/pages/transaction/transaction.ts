import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {

  tabs: any = 'finish';

  finish_transactions: any = [];
  pending_transactions: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.load_data();
  }

  load_data(){
  	this.finish_transactions = [
  		{
  			class : 'Breeder',
  			size: 'Small',
  			type: 'Tray',
  			qty: '5',
  			release: '2018-01-01'
  		},
  		{
  			class : 'Breeder',
  			size: 'Large',
  			type: 'Tray',
  			qty: '5',
  			release: '2018-01-01'
  		},
  	];

  	this.pending_transactions = [
  		{
  			class : 'Brown',
  			size: 'Small',
  			type: 'Tray',
  			qty: '5',
  			release: '2018-01-01'
  		},
  		{
  			class : 'Layer',
  			size: 'Large',
  			type: 'Tray',
  			qty: '5',
  			release: '2018-01-01'
  		},
  	];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionPage');
  }

}
