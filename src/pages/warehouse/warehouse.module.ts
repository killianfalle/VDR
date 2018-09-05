import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WarehousePage } from './warehouse';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    WarehousePage,
  ],
  imports: [
    IonicPageModule.forChild(WarehousePage),
    ComponentsModule
  ],
})
export class WarehousePageModule {}