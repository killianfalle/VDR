import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Generated class for the AddProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {

  product:any = {};
  _callback: any;
  error: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public loader: LoaderComponent,
    public toast: ToastComponent,
  	public provider: DataProvider
  ) {
    this._callback = navParams.get('callback');
  	this.initForm();
  }

  initForm() {
  	this.product = {
      product: null,
      classes: [{name : '' , size : [{name: ''}]}],
      quantities: [{name : ''}],
    };
  }

  add_class() {
  	this.product.classes.push({name : '' , size : [{name: ''}]});
  }

  add_size(_index) {
    this.product.classes[_index]['size'].push({ name : ''});
  }

  add_quantities() {
  	this.product.quantities.push({name: ''});
  }

  remove_class(_index) {
  	let root = this.product.classes.indexOf(this.product.classes[_index]);

  	if(root > -1){
  		this.product.classes.splice(root, 1);
  	}
  }

  remove_size(_root,_index) {
  	let root = this.product.classes[_root]['size'].indexOf(this.product.classes[_root]['size'][_index]);

  	if(root > -1){
  		this.product.classes[_root]['size'].splice(root, 1);
  	}
  }

  remove_quantities(_index) {
  	let root = this.product.quantities.indexOf(this.product.quantities[_index]);

  	if(root > -1){
  		this.product.quantities.splice(root, 1);
  	}
  }

  submit() {
  	this.provider.postData(this.product,'product/add').then((res: any) => {
  		if(res._data.status){
        this.toast.presentToast(res._data.message);
        this._callback(this.navParams.get('self'));
  			this.navCtrl.pop();
  		}
  	}).catch((error) => {
      console.log(JSON.parse(error._body).error.product);
      this.error = JSON.parse(error._body).error.product;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProductPage');
  }

}
