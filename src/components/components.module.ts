import { NgModule,
		 CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartComponent } from './cart/cart';
import { LogoComponent } from './logo/logo';
import { IonicPageModule,
		 IonicModule } from "ionic-angular";
import { SpinnerComponent } from './spinner/spinner';

@NgModule({
	declarations: [
		CartComponent,
		LogoComponent,
    	SpinnerComponent
	],
	imports: [
		IonicPageModule.forChild(CartComponent)
	],
	exports: [
		CartComponent,
		LogoComponent,
    	SpinnerComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class ComponentsModule {}
