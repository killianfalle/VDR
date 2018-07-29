import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         Platform,
         Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { Socket } from 'ng-socket-io';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  tab1Root = 'HomePage';
  tab2Root = 'StaffPage';
  tab3Root = 'WarehousePage';
  tab4Root = 'SettingsPage';

  profile: any;

  constructor(
    private socket: Socket,
    private provider: DataProvider,
    private event: Events,
    private platform: Platform) {
  	this.profile = JSON.parse(localStorage.getItem('_info'));
  	this.socket.connect();
    this.notification();
    this.getBadge();
  }

  ngOnInit(){
    if(localStorage.getItem('_device')){
      try {
        FCMPlugin.getToken((data) => {
          localStorage.setItem('_device',data);
          this.registerDevice(data);
        }, (result) => {
          console.log(result);
        })
      }catch(e) {
        console.error(e);
      }
    }
  }

  registerDevice(token){
    this.provider.postData({ token : token }, 'device/register').then((result:any) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }

  async notification(){
    try {
      await this.platform.ready();

      FCMPlugin.onNotification((data) => {
        console.log(data);
      }, (result) => {
        console.log(result);
      })
    }catch(e) {
      console.error(e);
    }
  }
  
  getBadge() {
    this.provider.getData('','notification/total').then((res: any) => {
      localStorage.setItem('badge',res._data.result);
      this.event.publish('notification:badge',null,res._data.result);
    });
  }

}
