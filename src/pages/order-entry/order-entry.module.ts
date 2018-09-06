import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderEntryPage } from './order-entry';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    OrderEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderEntryPage),
    ComponentsModule
  ],
})
export class OrderEntryPageModule {}
