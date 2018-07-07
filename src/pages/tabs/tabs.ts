import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'StaffPage';
  tab3Root = 'WarehousePage';
  tab4Root = 'SettingsPage';

  user: any;

  constructor() {
  	this.user = JSON.parse(localStorage.getItem('_info'));
  }
}
