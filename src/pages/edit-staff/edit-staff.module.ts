import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditStaffPage } from './edit-staff';

@NgModule({
  declarations: [
    EditStaffPage,
  ],
  imports: [
    IonicPageModule.forChild(EditStaffPage),
  ],
})
export class EditStaffPageModule {}
