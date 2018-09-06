import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionPage } from './transaction';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    TransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionPage),
    ComponentsModule
  ],
})
export class TransactionPageModule {}
