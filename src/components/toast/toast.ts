import {Injectable} from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastComponent {

	toast:any;

	constructor(public toastCtrl: ToastController) {}

	presentToast(msg) {
	  let toast = this.toastCtrl.create({
	    message: msg,
	    duration: 3000,
	    position: 'top'
	  });

	  toast.onDidDismiss(() => {
	    console.log('Dismissed toast');
	  });

	  toast.present();
	}
}