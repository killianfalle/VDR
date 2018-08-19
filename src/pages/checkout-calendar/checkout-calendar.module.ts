import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutCalendarPage } from './checkout-calendar';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    CheckoutCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutCalendarPage),
    CalendarModule
  ],
})
export class CheckoutCalendarPageModule {}
