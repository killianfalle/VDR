import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  @ViewChild(Nav) navChild: Nav;
  rootPage:any;
  signal_app_id: string = '43fc2482-fbe4-4fbb-bcc6-a1ba9cc4f34d';
  firebase_id: string = '317029700148';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private sqlite: SQLite, private oneSignal: OneSignal) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let token = localStorage.getItem('_token');

      if(token != null)
        this.rootPage = 'TabsPage';
      else
        this.rootPage = 'LoginPage';

      this.initLocalDB();
      statusBar.styleDefault();

      this.oneSignal.startInit(this.signal_app_id, 'ANDROID_ID');
      this.oneSignal.handleNotificationReceived().subscribe(() => {
      });
      this.oneSignal.handleNotificationOpened().subscribe(() => {
        this.nav.push('TransactionPage', {selectedTab: 'pending'});
      });
      this.oneSignal.endInit();


      splashScreen.hide();
    });
  }

  initLocalDB(){
    this.sqlite.create({
      name: 'vdr.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS Authenticated(id INTEGER PRIMARY KEY AUTOINCREMENT,email VARCHAR(191),password VARCHAR(191), remember BOOLEAN DEFAULT TRUE NOT NULL)')
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }
}
