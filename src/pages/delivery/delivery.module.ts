import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryPage } from './delivery';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DeliveryPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryPage),
    ComponentsModule
  ],
})
export class DeliveryPageModule {}
