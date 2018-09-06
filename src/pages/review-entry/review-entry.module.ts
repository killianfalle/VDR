import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewEntryPage } from './review-entry';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    ReviewEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewEntryPage),
    ComponentsModule
  ],
})
export class ReviewEntryPageModule {}
