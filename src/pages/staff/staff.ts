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

  offset:any = 0;
  limit:any = 20;

  isBusy:any = false;

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
        params = { self : this, callback : this.refresh };
        this.navCtrl.push(page, params );
        break;
      case "edit":
        params = { self : this, callback : this.refresh, data : _params };
        this.navCtrl.push(page, params );
        break;
      default:
        break;
    }
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


}
