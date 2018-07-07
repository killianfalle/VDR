import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';

/**
 * Generated class for the StaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staff',
  templateUrl: 'staff.html',
})
export class StaffPage implements OnInit{

  result: any = 0;
  staffs: any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider) {
  }

  ngOnInit(self = this) {
    self.provider.getData('','get_staff').then((res: any) => {
        if(res._data.status){
          self.result = res._data.result;
          self.staffs = res._data.data;
        }
    })
  }

  navigate() {
  	this.navCtrl.push('AddStaffPage',{
      self : this,
      callback : this.ngOnInit
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffPage');
  }

}
