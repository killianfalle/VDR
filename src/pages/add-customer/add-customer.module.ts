import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCustomerPage } from './add-customer';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    AddCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCustomerPage),
    ComponentsModule
  ],
})
export class AddCustomerPageModule {}
