import { Injectable } from '@angular/core';
import { ToastController, 
		 AlertController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import 'rxjs/add/operator/map';

@Injectable()
export class PrinterProvider {

	loader: any;

	constructor(
		private toastCtrl: ToastController,
		private alertCtrl: AlertController,
		private bluetoothSerial: BluetoothSerial)
	{ }

	connectivity() {
		return this.bluetoothSerial.isConnected();
	}

	connect(_address) {
		return this.bluetoothSerial.connect(_address);
	}

	show_unpaired_device() {
		return this.bluetoothSerial.discoverUnpaired();
	}

	onWrite(_data){
		this.bluetoothSerial.write(_data).then(
			success => {
				console.log('success');
				console.log(success);
			},
			error => {
				console.log("error");
				console.log(error);
			}
		);
	}
}
