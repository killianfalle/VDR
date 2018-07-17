import {Injectable} from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertComponent {

	constructor(private alertCtrl: AlertController) { }

	confirm(){
		return new Promise((resolve, reject) => {
			this.alertCtrl.create({
			    title: '',
			    message: 'Are you sure you want to continue ?',
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

}