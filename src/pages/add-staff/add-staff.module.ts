import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddStaffPage } from './add-staff';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    AddStaffPage,
  ],
  imports: [
    IonicPageModule.forChild(AddStaffPage),
    ComponentsModule
  ],
})
export class AddStaffPageModule {}
