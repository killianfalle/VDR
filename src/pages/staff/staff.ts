import { Component,
         OnInit } from '@angular/core';
import { IonicPage,
         NavController, 
         NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';

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

  staffs: any = [];
  keyword: any = '';
  result: any = 0;

  isBusy:any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider,
    public loader: LoaderComponent) {
  }

  ngOnInit(self = this) {
    self.isBusy = false;
    self.provider.getData({ search : self.keyword },'staff').then((res: any) => {
        if(res._data.status){
          self.result = res._data.result;
          self.staffs = res._data.data;
        }
        self.isBusy = true;
    })
  }

  navigate() {
  	this.navCtrl.push('AddStaffPage',{
      self : this,
      callback : this.ngOnInit
    });
  }

  reset() {
    this.keyword = '';
    this.result = [];
    this.ngOnInit();
  }

  search() {
    this.result = [];
    this.ngOnInit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }


}
