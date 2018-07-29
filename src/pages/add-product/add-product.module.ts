import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProductPage } from './add-product';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    AddProductPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProductPage),
    ComponentsModule
  ],
})
export class AddProductPageModule {}
