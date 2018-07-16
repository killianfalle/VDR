import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'StaffPage';
  tab3Root = 'WarehousePage';
  tab4Root = 'SettingsPage';

  profile: any;

  constructor(private socket: Socket) {
  	this.profile = JSON.parse(localStorage.getItem('_info'));
  	this.socket.connect();
  }
}
