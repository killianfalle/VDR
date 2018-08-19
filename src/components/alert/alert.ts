import {Injectable} from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertComponent {

	constructor(private alertCtrl: AlertController) { }

	confirm(title = ''){
		return new Promise((resolve, reject) => {
			this.alertCtrl.create({
			    title: title,
			    message: 'Do you want to continue ?',
			    buttons: [
			      {
			        text: 'No',
			        role: 'no',
			        handler: () => {
			          resolve(false);
			        }
			      },
			      {
			        text: 'Yes',
			        role: 'yes',
			        handler: () => {
			          resolve(true);
			        }
			      }
			    ],
			    enableBackdropDismiss: false
		    }).present();
		});
	}

	prompt_payment() {
		return new Promise((resolve, reject) => {
			this.alertCtrl.create({
			  title: 'Payment',
			  inputs: [
			    {
			      type: 'radio',
			      label:'Cash',
	        	  value:'cash'
			    },
			    {
			      type: 'radio',
			      label:'Cash on Delivery',
	        	  value:'Cash on Delivery'
			    },
			    {
			      type: 'radio',
			      label:'A/R or Charge',
	        	  value:'A/R or Charge'
			    },
			    {
			      type: 'radio',
			      label:'Partial Payment',
	        	  value:'Partial Payment'
			    }
			  ],
			  buttons: [
			    {
			      text: 'Cancel',
			      role: 'cancel',
			      handler: data => {
			        resolve(false);
			      }
			    },
			    {
			      text: 'Ok',
			      handler: data => {
			        resolve(data);
			      }
			    }
			  ]
			}).present();
		});
	}

	confirm_print(){
		return new Promise((resolve, reject) => {
			this.alertCtrl.create({
			    title: '',
			    message: 'Continue to print ?',
			    buttons: [
			      {
			        text: 'Continue',
			        role: 'yes',
			        handler: () => {
			        	resolve(true);
			        }
			      }
			    ],
			    enableBackdropDismiss: false
		    }).present();
		});
	}

	show_dialog(title,msg) {
	  let alert = this.alertCtrl.create({
	    title: title,
	    subTitle: msg,
	    buttons: ['Dismiss']
	  });
	  alert.present();
	}

}