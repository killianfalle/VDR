import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WarehouseManagementPage } from './warehouse-management';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    WarehouseManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(WarehouseManagementPage),
    ComponentsModule
  ],
})
export class WarehouseManagementPageModule {}
