import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPaymentPage } from './edit-payment';

@NgModule({
  declarations: [
    EditPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPaymentPage),
  ],
})
export class EditPaymentPageModule {}
