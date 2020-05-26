import { Component,
         OnInit,
         ViewChild } from '@angular/core';
import { IonicPage, 
         NavController, 
         NavParams,
         Keyboard,
         InfiniteScroll } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';
import { AlertComponent } from '../../components/alert/alert';

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

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  staffs: any = [];
  keyword: any = '';
  result: any = 0;
  toggleReorder = 'Edit';
  flag: any = false;

  offset:any = 0;
  limit:any = 20;

  isBusy:any = false;
  warehouseList:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private keyboard: Keyboard,
    private provider: DataProvider,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    public toast: ToastComponent,
  ) 
  { }

  ngOnInit(self = this) {
    self.isBusy = false;
    self.provider.getData({ search : self.keyword, offset : self.offset, limit : self.limit },'staff').then((res: any) => {
        if(res._data.status){
          this.warehouseList = res._data.warehouseList;
          console.log("WAREHOUSE LIST:");
          console.log(this.warehouseList);
          if(res._data.result > 0){
            self.offset += res._data.result;
            self.loadData(res._data.data);
          }else {
            self.stopInfinite(self);
          }
        }
        self.isBusy = true;
    });
  }

  ionViewWillEnter(){
    console.log(this.staffs);
  }

  loadData(_customer) {
    _customer.map(data => {
      this.staffs.push(data);
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.ngOnInit();

      infiniteScroll.complete();
    }, 500);
  }

  stopInfinite(_self){
    _self.infinite.enable(false);
  }

  refresh(self = this, reload = false) {
    if(!reload){
      self.ngOnInit(self);
    }else {
      self.offset = 0;
      self.staffs = [];
      self.ngOnInit(self);
    }
  }

  navigate(page,type = null,_params = null) {
    let params = {};

    switch (type) {
      case "add":
        params = { self : this, callback : this.refresh, warehouseList: this.warehouseList };
        this.navCtrl.push(page, params );
        break;
      case "edit":
        params = { self : this, callback : this.refresh, data : _params, warehouseList: this.warehouseList };
        this.navCtrl.push(page, params );
        break;
      default:
        break;
    }
  }

  show_confirmation(id,action) {
    switch(action){
      case 'reset' :
        this.alert.confirm('Reset Password').then((res:any) => {
          if(res) {
            this.resetPassword(id);
          }
        })
        break;
      case 'delete' :
        this.alert.confirm('Delete Staff').then((res:any) => {
          if(res) {
            this.delete(id);
          }
        })
        break;
      case 'restore':
        this.alert.confirm('Restore Staff').then((res:any) => {
          if(res) {
            this.restore(id);
          }
        })
        break;
      default:
        break;
    }
  }

  on_restore(id) {
    this.alert.confirm('Delete Staff').then((res:any) => {
      if(res) {
        this.delete(id);
      }
    })
  }

  change_access(staff, event){
    console.log(event._value)
    console.log(staff)
    this.provider.postData({ id: staff.id, admin_access: event._value },'staff/update_access').then((res:any) => {
      console.log(res);
    })
  }

  resetPassword(id) {
    this.provider.postData({ id: id },'staff/password/reset').then((res:any) => {
      if (res._data.status) {
        this.toast.presentToast(res._data.message);
      }
    }).catch((error) => {
      console.log(error);
      this.toast.presentToast("Failed to reset password. Please try again.");
    })
  }


  delete(id) {
    this.provider.postData({ id: id },'staff/delete').then((res:any) => {
      if (res._data.status) {
        this.toast.presentToast(res._data.message);
        this.refresh(this,true);
      }
    }).catch((error) => {
      console.log(error);
      this.toast.presentToast("Failed to delete. Please try again.");
    })
  }

  restore(id) {
    this.provider.postData({ id: id },'staff/restore').then((res:any) => {
      if (res._data.status) {
        this.toast.presentToast(res._data.message);
        this.refresh(this,true);
      }
    }).catch((error) => {
      console.log(error);
      this.toast.presentToast("Failed to restore. Please try again.");
    })
  }

  reset() {
    this.keyword = '';
    this.offset = 0;
    this.staffs = [];
    this.ngOnInit();
  }

  search() {
    this.keyboard.close();
    this.offset = 0;
    this.staffs = [];
    this.ngOnInit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

  reorderItems(indexes){
    let element = this.staffs[indexes.from];
    this.staffs.splice(indexes.from, 1);
    this.staffs.splice(indexes.to, 0, element);
  }

  reorderList(){
    if(this.toggleReorder == 'Edit'){
      this.toggleReorder = 'Done';
      this.flag = true;
    }else{
      this.toggleReorder = 'Edit';
      this.flag = false;
      console.log(this.staffs);
      for(let i = 0; i < this.staffs.length; i++){
        this.staffs[i].position = i;
        console.log(this.staffs[i])
        this.provider.postData(this.staffs[i], 'staff/reorder', true).then((res:any) => {
          console.log(res)
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }

}
