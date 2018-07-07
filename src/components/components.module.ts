import { NgModule,
		 CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartComponent } from './cart/cart';
import { IonicPageModule,
		 IonicModule } from "ionic-angular";

@NgModule({
	declarations: [CartComponent],
	imports: [IonicPageModule.forChild(CartComponent)],
	exports: [CartComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
