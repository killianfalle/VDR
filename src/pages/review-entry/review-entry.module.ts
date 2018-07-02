import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewEntryPage } from './review-entry';

@NgModule({
  declarations: [
    ReviewEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewEntryPage),
  ],
})
export class ReviewEntryPageModule {}
