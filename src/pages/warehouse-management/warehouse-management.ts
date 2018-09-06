import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';

/**
 * Generated class for the WarehouseManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  	selector: 'page-warehouse-management',
  	templateUrl: 'warehouse-management.html',
})
export class WarehouseManagementPage {
	showAddForm: boolean = false;
	showEditForm: boolean = false;
	addForm: any = {
		'name': '',
		'address': '',
	};
	updateForm: any = {
		'id': '',
		'name': '',
		'address': '',
	};
	apiValidators: any = {
		'name': '',
		'address': '',
	};
	warehouseList: any = [];

  	constructor(
  		public navCtrl: NavController, 
  		public navParams: NavParams, 
  		private provider: DataProvider,
  		public loadingCtrl: LoadingController,
  		public alertCtrl: AlertController
  	){
  		this.provider.getData({} ,'get-warehouses').then((res: any) => {
  			console.log("RESPONSE:");
  			console.log(res);
  			this.warehouseList = res.warehouses;
  		})
  	}

  	setAddForm(showForm){
  		this.clearApiValidators();
  		for(var key in this.addForm){
  			this.addForm[key] = '';
  		}
  		this.showAddForm = showForm;
  	}

  	submitAddForm(){
  		const loader = this.loadingCtrl.create({
	      	content: "Please wait...",
	      	duration: 3000
	    });
	    loader.present();
	    this.clearApiValidators();

  		this.provider.postData(this.addForm ,'save-new-warehouse').then((res: any) => {
	      	this.warehouseList.push(res.whInfo);
	      	this.showAddForm = false;

			const alert = this.alertCtrl.create({
				title: 'Warehouse saved!',
				subTitle: 'New warehouse successfully saved...',
				buttons: ['OK']
			});
			alert.present();

	      	loader.dismiss();
	    }).catch((error) => {
	    	var errors = JSON.parse(error._body).error;
	    	for(var key in errors){
	    		this.apiValidators[key] = errors[key][0];
	    	}
	    	loader.dismiss();
	      
	    });
  	}

  	selectToEdit(warehouseID){
  		console.log("WAREHOUSE ID: "+warehouseID);
  		this.clearApiValidators();
  		for(var counter = 0; counter < this.warehouseList.length; counter++){
  			if(this.warehouseList[counter]['id'] == warehouseID){
  				this.updateForm['id'] = this.warehouseList[counter]['id'];
  				this.updateForm['name'] = this.warehouseList[counter]['name'];
  				this.updateForm['address'] = this.warehouseList[counter]['address'];
  				this.showEditForm = true;
  				break;
  			}
  		}
  		console.log("UPDATE FORM:");
  		console.log(this.updateForm);
  	}

  	submitEditForm(){
  		const loader = this.loadingCtrl.create({
	      	content: "Please wait...",
	      	duration: 3000
	    });
	    loader.present();
	    this.clearApiValidators();

	    this.provider.postData(this.updateForm ,'update-warehouse').then((res: any) => {
	    	for(var counter = 0; counter < this.warehouseList.length; counter++){
	    		if(this.warehouseList[counter]['id'] == this.updateForm.id){
	    			this.warehouseList[counter]['name'] = this.updateForm['name'];
	    			this.warehouseList[counter]['address'] = this.updateForm['address'];
	    			break;
	    		}
	    	}

	      	this.showEditForm = false;

			const alert = this.alertCtrl.create({
				title: 'Warehouse updated!',
				subTitle: 'Warehouse successfully updated...',
				buttons: ['OK']
			});
			alert.present();

	      	loader.dismiss();
	    }).catch((error) => {
	    	var errors = JSON.parse(error._body).error;
	    	for(var key in errors){
	    		this.apiValidators[key] = errors[key][0];
	    	}
	    	loader.dismiss();
	      
	    });
  	}


  	clearApiValidators(){
  		for(var key in this.apiValidators){
  			this.apiValidators[key] = '';
  		}
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad WarehouseManagementPage');
  	}

}
