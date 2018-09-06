import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private sqlite: SQLite) {
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
      splashScreen.hide();
    });
  }

  initLocalDB(){
    this.sqlite.create({
      name: 'vdr.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS Authenticated(id INTEGER PRIMARY KEY AUTOINCREMENT,email VARCHAR(191),password VARCHAR(191), remember BOOLEAN DEFAULT TRUE NOT NULL)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }
}
