import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
import { ComponentsModule } from "../../components/components.module";
import { LongPressModule } from 'ionic-long-press';

@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    ComponentsModule,
    LongPressModule
  ],
})
export class CartPageModule {}
