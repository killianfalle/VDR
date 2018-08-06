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