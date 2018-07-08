import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerEntryPage } from './customer-entry';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    CustomerEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerEntryPage),
    ComponentsModule
  ],
})
export class CustomerEntryPageModule {}
