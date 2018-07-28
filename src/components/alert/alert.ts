import {Injectable} from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertComponent {

	constructor(private alertCtrl: AlertController) { }

	confirm(){
		return new Promise((resolve, reject) => {
			this.alertCtrl.create({
			    title: '',
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

	receiver(){
		return new Promise((resolve, reject) => {
			this.alertCtrl.create({
		      title: 'Enter Receiver Name',
		      inputs: [
		        {
		          name: 'received_by',
		          placeholder: 'Receiver name'
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
		          text: 'Save',
		          handler: data => {
		            if(data.received_by != ''){
		              resolve(data.received_by);
		            }
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