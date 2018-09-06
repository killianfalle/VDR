import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerPage } from './customer';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    CustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerPage),
    ComponentsModule
  ],
})
export class CustomerPageModule {}
