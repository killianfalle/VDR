import { Component } from '@angular/core';
import { IonicPage,
		 ViewController, 
		 NavController, 
		 NavParams } from 'ionic-angular';
import { AlertComponent } from '../../components/alert/alert';

/**
 * Generated class for the VoidFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-void-form',
  templateUrl: 'void-form.html',
})
export class VoidFormPage {

  reason: any;

  constructor(
  	public navCtrl: NavController,
  	public viewCtrl: ViewController,
  	public alert: AlertComponent,
  	public navParams: NavParams) {
  }

  save() {
  	if(this.reason != null){
  		this.alert.confirm().then((response:any) => {
  			if(response){
  				this.dismiss(this.reason);
  			}else {
  				this.dismiss();
  			}
  		});
  	}
  }

  dismiss(param = null) {
  	this.viewCtrl.dismiss(param);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VoidFormPage');
  }

}
