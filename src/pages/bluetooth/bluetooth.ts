import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
import { PrinterProvider } from '../../providers/printer';
import { LoaderComponent } from '../../components/loader/loader';
/**
 * Generated class for the BluetoothPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

  list = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public loader: LoaderComponent,
  	public blt: PrinterProvider) {
  	
  	this.getNearbyDevice();
  }

  getNearbyDevice() {
  	this.blt.show_unpaired_device().then((res: any) => {
  		console.log(res);
  		this.list = res;
  	})
  }

  connect_device(_address,_class) {
  	if(_class != 268) {
	  	this.blt.connect(_address).subscribe((res: any) => {
	  		this.navCtrl.pop();
	  	});
  	} else {
  		console.log("Cant Connect");
  	}
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }


}
