import { Component } from '@angular/core';
import { IonicPage,
		 NavController } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profile:any = {};

  constructor(
  	public navCtrl: NavController,
  	public loader: LoaderComponent) {
    this.profile = JSON.parse(localStorage.getItem('_info'));
  }

  navigate(page){
  	this.navCtrl.push(page, {});
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }


}
