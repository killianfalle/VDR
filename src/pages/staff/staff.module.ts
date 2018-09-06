import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffPage } from './staff';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    StaffPage,
  ],
  imports: [
    IonicPageModule.forChild(StaffPage),
    ComponentsModule
  ],
})
export class StaffPageModule {}
