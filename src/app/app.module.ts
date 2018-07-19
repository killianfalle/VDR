import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoaderComponent } from '../components/loader/loader';
import { AlertComponent } from '../components/alert/alert';
import { DataProvider } from '../providers/data-provider';
import { PrinterProvider } from '../providers/printer';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const socket: SocketIoConfig = { url: 'http://192.168.90.66:3001', options: {} };

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
    AlertComponent,
    DataProvider,
    PrinterProvider,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
