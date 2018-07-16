import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerTransactionPage } from './customer-transaction';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    CustomerTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerTransactionPage),
    ComponentsModule
  ],
})
export class CustomerTransactionPageModule {}
