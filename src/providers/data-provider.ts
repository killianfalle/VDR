import { Injectable } from '@angular/core';
import { Http,
         Headers } from '@angular/http';
import { APP_API } from '../app/app-source';
import { App,
		 Events,
		 Toast, 
		 ToastController, 
		 AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class DataProvider {

	api: any = APP_API;
	loader: any;
	signal_app_id: string = '43fc2482-fbe4-4fbb-bcc6-a1ba9cc4f34d';
	firebase_id: string = '317029700148';
	rest_api_key: string = 'OWJlZGNiZDYtNmZmNS00NWQ0LWEzMzktYzcyYTNiYjAyYThi';

	private toastInstance: Toast;
	public alertPresented: any; 

	constructor(
		public http: Http,
		private toastCtrl: ToastController,
		public app: App,
		private alertCtrl: AlertController,
     	public events: Events)
	{ }

	postData(data, route, reorder = false){
		return new Promise((resolve, reject) => {
			let token = localStorage.getItem('_token');
			console.log('tokeeen: ', token);
			let headers = new Headers();
			console.log('headers: ', headers)
			headers.append('Authorization', 'Bearer ' + token);
			headers.append('Accept', 'application/json');
			headers.append('Content-Type', 'application/json');
			
			this.http.post(this.api.src+route, JSON.stringify(data), {headers: headers}).subscribe(res => {
				if(!reorder){
					resolve(res.json());
				}
			}, (err) => {        
				reject(err);
			});
		})
	}

	getData(data, route){
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			let token = localStorage.getItem('_token');

			if(token != null){
				headers.append('Authorization', 'Bearer ' + token);
			}

			let params = (data != undefined || data != '' ? '?' + this.serialize(data) : '');
			console.log(this.api.src+route+params);
			this.http.get(this.api.src+route+params, {headers: headers}).subscribe( res => {
				resolve(res.json());
			}, (err) => {        
				reject(this.errorReponseHandler(err));
			});
		});
	}

	serialize(obj) {
		var str = [];
		for(var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		return str.join("&");
	}

	errorReponseHandler(err){
		let result:any;
		switch (err.status) {
			case 400: // Invalid token
				localStorage.clear();
				result= JSON.parse(err._body);
				this.presentAlert('Warning', result.message);
				localStorage.clear(); 
				break;

			case 401: // Expired Token
				localStorage.clear();
				result = JSON.parse(err._body);
				this.presentAlert('Warning', result.message);

				setTimeout(() => {
					const root  = this.app.getRootNav();
					root.popToRoot();
				}  , 1000);
				break;

			case 403:
				this.presentToast('Access is forbidden');
				break;

			case 404:
				this.presentToast( 'Unable to connect to the server');
				break;

			case 406:
				this.presentToast( JSON.parse(err._body).error.message );
				break;

			case 0:
				this.presentToast('Unable to connect to the internet. Please try again later.');
				break;
		}

		return err;
	}

	presentToast(msg, duration = 5000) {

		if(this.toastInstance ){
			console.log("Toast is already present!");
		}else{
			this.toastInstance = this.toastCtrl.create({
				message: msg,
				duration: duration,
				position: 'top',
				dismissOnPageChange: true,
				showCloseButton: true,
				closeButtonText: 'close',
			});

			this.toastInstance.onDidDismiss(() => {
				this.toastInstance = null;
			});

			this.toastInstance.present();
		}

	}

	presentAlert(title = '', message = '') {
		if(!this.alertPresented) {
			this.alertPresented = true
			this.alertCtrl.create({
				title: title,
				subTitle: message,
				buttons: [{
					text: 'Dismiss',
					handler: () => {
						this.alertPresented = false
					}
				}],
			}).present();
		}
	}

	hideLoader(){
		this.loader.dismiss();
	}

	CartToPending(orderNumber){
        let headers = new Headers();
		headers.append('Authorization', 'Basic ' + this.rest_api_key);
		headers.append('Content-type', 'application/json');
		var body = {
			app_id: this.signal_app_id,
			included_segments: ['Cashier and Admin'],
			contents: {
				en: `Order Number: ${orderNumber}`
			},
			headings: {
				en: 'A new order has arrived. Click to view.'
			},
			small_icon: "assets/imgs/vdr-logo.jpg",
			large_icon: "assets/imgs/vdr-logo.jpg"
		};
		this.http.post('https://onesignal.com/api/v1/notifications', body, {headers: headers}).subscribe(data => {
			console.log(data);
		} , error => {
			console.log(error);
		});
    }
}
