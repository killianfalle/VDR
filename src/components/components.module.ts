import { NgModule,
		 CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartComponent } from './cart/cart';
import { LogoComponent } from './logo/logo';
import { IonicPageModule,
		 IonicModule } from "ionic-angular";

@NgModule({
	declarations: [
		CartComponent,
		LogoComponent
	],
	imports: [
		IonicPageModule.forChild(CartComponent)
	],
	exports: [
		CartComponent,
		LogoComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class ComponentsModule {}
