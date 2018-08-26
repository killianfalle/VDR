import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductInfoPage } from './product-info';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    ProductInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductInfoPage),
    ComponentsModule
  ],
})
export class ProductInfoPageModule {}
