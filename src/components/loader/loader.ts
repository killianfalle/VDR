import {Injectable} from '@angular/core';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class LoaderComponent {

	css:any;
	spinner:any;
	content:any;
	load:any;

	constructor(public loadingCtrl: LoadingController) {}

	show_loader(type = 'page'){
		switch (type) {
			case "auth":
				this.content = `
							  <div class="custom-spinner-container">
							    <div class="custom-spinner-box">Authenticating..</div>
							  </div>`;
				this.spinner = 'crescent';
				this.css = 'custom';
				break;

			case "processing":
				this.content = `
							  <div class="custom-spinner-container">
							    <div class="custom-spinner-box"></div>
							  </div>`;
				this.spinner = 'bubbles';
				this.css = 'custom';
				break;

			case "submit":
				this.content = `
							  <div class="custom-spinner-container">
							    <div class="custom-spinner-box"></div>
							  </div>`;
				this.spinner = 'crescent';
				this.css = null;
				break;
			
			default:
				this.css = 'default';
				this.content = '';
				this.spinner = 'dots';
				break;
		}

		this.show(this.content,this.spinner,this.css);
	}
  
	show(content,spinner,css){
		this.load = this.loadingCtrl.create({
			cssClass: css,
			content: content,
			spinner: spinner,
			dismissOnPageChange: false
		});

		this.load.present();
	}

	hide_loader(){
		this.load.dismiss();
	}

}