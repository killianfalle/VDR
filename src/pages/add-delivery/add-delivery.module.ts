import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDeliveryPage } from './add-delivery';

@NgModule({
  declarations: [
    AddDeliveryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDeliveryPage),
  ],
})
export class AddDeliveryPageModule {}
