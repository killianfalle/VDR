import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoaderComponent } from '../components/loader/loader';
import { ToastComponent } from '../components/toast/toast';
import { AlertComponent } from '../components/alert/alert';
import { DataProvider } from '../providers/data-provider';
import { PrinterProvider } from '../providers/printer';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SQLite } from '@ionic-native/sqlite';
import { Keyboard } from '@ionic-native/keyboard';
import { File } from '@ionic-native/file';
import { DecimalPipe } from '@angular/common';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const socket: SocketIoConfig = { url: 'http://192.168.1.7:3001', options: {} };

var config = {
      backButtonText: '',
      iconMode: 'ios',
      mode:'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      pageTransition: 'ios',
      tabsHideOnSubPages: true,
    };

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,config),
    SocketIoModule.forRoot(socket),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LoaderComponent,
    ToastComponent,
    AlertComponent,
    DataProvider,
    PrinterProvider,
    BluetoothSerial,
    SQLite,
    Keyboard,
    File,
    DecimalPipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
