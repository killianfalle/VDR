import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerEntryPage } from './customer-entry';

@NgModule({
  declarations: [
    CustomerEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerEntryPage),
  ],
})
export class CustomerEntryPageModule {}
