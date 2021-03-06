import { Component,
         OnInit,
         ViewChild } from '@angular/core';
import { IonicPage,
         Platform,
         Events,
         Tabs } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { Socket } from 'ng-socket-io';
import { Keyboard } from '@ionic-native/keyboard';
import { FCM } from '@ionic-native/fcm';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  @ViewChild('userTabs') userTabs: Tabs;

  tab1Root = 'HomePage';
  tab2Root = 'StaffPage';
  tab3Root = 'WarehousePage';
  tab4Root = 'TransactionPage';
  tab5Root = 'SettingsPage';
  tab6Root = 'ReportPage';

  profile: any;

  constructor(
    private socket: Socket,
    private provider: DataProvider,
    private event: Events,
    public keyboard: Keyboard,
    private fcm: FCM,
    public oneSignal: OneSignal,
    private platform: Platform) {
  	this.profile = JSON.parse(localStorage.getItem('_info'));

    platform.ready().then(() => {
      keyboard.onKeyboardShow().subscribe(() => {
          document.body.classList.add('keyboard-is-open');
      });

      keyboard.onKeyboardHide().subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
      });
    });
    
  	this.socket.connect();
    this.notification();
  }

  ngOnInit(){
    console.log(this.profile)
    this.oneSignal.sendTags({session: 'logged_in', user_type: this.profile.type, email: this.profile.email});

    if(localStorage.getItem('_device')){
      try {
        this.fcm.getToken().then((data) => {
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

      this.fcm.onNotification().subscribe((data) => {
        console.log(data);
      }, (result) => {
        console.log(result);
      })
    }catch(e) {
      console.error(e);
    }
  }

}
