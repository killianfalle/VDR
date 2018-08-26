import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams } from 'ionic-angular';
 import { DataProvider } from '../../providers/data-provider';
 import { LoaderComponent } from '../../components/loader/loader';
 import { ToastComponent } from '../../components/toast/toast'
 import { AlertComponent } from '../../components/alert/alert'

/**
 * Generated class for the EditProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html',
})
export class EditProductPage {

	product:any = {};
	_callback: any;
	origin: any;

  error: any;

  validation: any = {
    name : true,
    class : true,
    size : true,
    quantity : true,
  }

  constructor(
	public navCtrl: NavController, 
	public navParams: NavParams,
	public loader: LoaderComponent,
  public toast: ToastComponent,
	public alert: AlertComponent,
	public provider: DataProvider
  ) {
  	this._callback = navParams.get('callback');
  	this.origin = navParams.get('self');
  	this.initForm();
  }

  initForm() {
  	this.product = this.navParams.get('data');
  	if(localStorage.getItem('edit_product') != null){
  		let _product = JSON.parse(localStorage.getItem('edit_product'));
  		if(this.product.id == _product.id){
  			this.product = JSON.parse(localStorage.getItem('edit_product'));
  		}else {
  			localStorage.setItem('edit_product',JSON.stringify(this.product));
  		}
  	}else {
  		localStorage.setItem('edit_product',JSON.stringify(this.product));
  	}
  }

  add_class() {
  	this.product.class.push({id : '', name : '', status: 'active', size : [{id: '', name: '', status: 'active'}]});
  }

  add_size(_index) {
    this.product.class[_index]['size'].push({id: '', name: '', status: 'active'});
  }

  add_quantities() {
  	this.product.quantity.push({id: '', name: '', status: 'active'});
  }

  remove_class(_index) {
    if(this.product.class[_index]['id'] != ''){
      this.alert.confirm(
        'Remove Class',
      ).then((response:any) => {
        if(response){
          this.do_remove_class(_index);
        }
      })
    }else {
      this.do_remove_class(_index);
    }
  }

  do_remove_class(_index) {
    this.product.class[_index]['status'] = 'inactive';

    for (let count = 0; count < this.product.class[_index]['size'].length; count++) {
      this.product.class[_index]['size'][count]['status'] = 'inactive';
    }
  }

  remove_size(_root,_index) {
    if(this.product.class[_root]['size'][_index]['id'] != ''){
      this.alert.confirm(
        'Remove Size',
      ).then((response:any) => {
        if(response){
          this.do_remove_size(_root,_index);
        }
      })
    }else {
      this.do_remove_size(_root,_index);
    }
  }

  do_remove_size(_root,_index) {
  	this.product.class[_root]['size'][_index]['status'] = 'inactive';
  }

  remove_quantities(_index) {
    if(this.product.quantity[_index]['id'] != ''){
      this.alert.confirm(
        'Remove Quantity',
      ).then((response:any) => {
        if(response){
          this.do_remove_quantities(_index);
        }
      })
    }else {
      this.do_remove_quantities(_index);
    }
  }

  do_remove_quantities(_index) {
    this.product.quantity[_index]['status'] = 'inactive';
  }

  save() {
    console.log(this.product);
    if(this.product.name != ''){
      this.validation.name = true;

      if(this.product.class.length > 0){
        for (let count = 0; count < this.product.class.length; count++) {
          if(this.product.class[count]['id'] != '' && this.product.class[count]['name'] == ''){
            console.log("have error in class");
            this.validation.class = false;
            break;
          }else{
            this.validation.class = true;

            for (let counter = 0; counter < this.product.class[count]['size'].length; counter++) {
              if(this.product.class[count]['size'][counter]['id'] != '' && this.product.class[count]['size'][counter]['name'] == ''){
                console.log("have error in size");
                this.validation.size = false;
                break;
              }else {
                this.validation.size = true;
              }
            }
          }
        }
      }

      if(this.product.quantity.length > 0) {
        for (let counter = 0; counter < this.product.quantity.length; counter++) {
          if(this.product.quantity[counter]['id'] != '' && this.product.quantity[counter]['name'] == ''){
            console.log("have error in quantity");
            this.validation.quantity = false;
            break;
          }else {
            this.validation.quantity = true;
          }
        }
      }

      this.submit();
    }else {
      this.validation.name = false;
    }

    if(this.validation.name == false || this.validation.class == false || this.validation.size == false || this.validation.quantity == false){
      this.alert.show_dialog("Error","Please fill all required fields");
    }
  }

  submit() {
    if(this.validation.name == true && this.validation.class == true && this.validation.size == true && this.validation.quantity == true){
      this.provider.postData(this.product,'product/update').then((res: any) => {
        if(res._data.status){
        localStorage.removeItem('edit_product');
          this.toast.presentToast(res._data.message);
          this._callback(this.navParams.get('self'));
          this.navCtrl.pop();
        }
      }).catch((error) => {
        console.log(JSON.parse(error._body).error.name);
        this.error = JSON.parse(error._body).error.name;
      });
    }
  }

  ionViewWillLeave() {
  	this.product = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProductPage');
  }

}
