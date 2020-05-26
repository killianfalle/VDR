import { Component } from '@angular/core';
import { IonicPage,
    		 NavController, 
    		 NavParams, 
         reorderArray} from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { ToastComponent } from '../../components/toast/toast';

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  toggleReorder = 'Edit';
  products: any = [];
  keyword: any = '';
  result: any = 0;
  isBusy: any = false;
  flag: any = false;
  profile: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private provider: DataProvider,
    private alert: AlertComponent,
  	private toast: ToastComponent,
    public loader: LoaderComponent) 
  { }

  ngOnInit(self = this) {
    self.isBusy = false;
    self.provider.getData({ search : self.keyword },'product').then((res: any) => {
      console.log(res._data.data)
        if(res._data.status){
          self.products = res._data.data;
          self.result = res._data.result;
        }
        self.isBusy = true;
    })
  }

  refresh(self = this, reload = false) {
    if(!reload){
      self.ngOnInit(self);
    }else {
      self.result = 0;
      self.products = [];
      self.ngOnInit(self);
    }
  }

  reorderItem(indexes){
    console.log(indexes);
    this.products = reorderArray(this.products, indexes)
    // this.products.forEach(item => {
    // });
    console.log(this.products[indexes.from]);
    console.log(this.products);
  }

  navigate(page) {
    let params = { self : this, callback : this.refresh };
    this.navCtrl.push(page, params );
  }

  on_edit(_data) {
    let params = { self : this, data : _data, callback : this.refresh };
    this.navCtrl.push('EditProductPage', params );
  }

  view_info(_info) {
    this.navCtrl.push('ProductInfoPage',{ info : _info });
  }

  remove(_data) {
    this.alert.confirm('Delete Product').then((response: any) => {
      if(response){
        this.loader.show_loader('processing');
        this.provider.postData({ id : _data.id },'product/delete').then((res:any) => {
          if(res._data.status){
            this.loader.hide_loader();
            this.toast.presentToast(res._data.message);
            this.ngOnInit();
          }
        })
      }
    })
  }

  reset() {
    this.keyword = '';
    this.products = [];
    this.ngOnInit();
  }

  reorderItems(indexes){
    let element = this.products[indexes.from];
    this.products.splice(indexes.from, 1);
    this.products.splice(indexes.to, 0, element);
  }

  reorderList(){
    if(this.toggleReorder == 'Edit'){
      this.toggleReorder = 'Done';
      this.flag = true;
    }else{
      this.toggleReorder = 'Edit';
      this.flag = false;
      console.log(this.products);
      for(let i = 0; i < this.products.length; i++){
        this.products[i].position = i;
        console.log(this.products[i])
        this.provider.postData(this.products[i], 'product/reorder', true).then((res:any) => {
          console.log(res)
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }

  search() {
    this.products = [];
    this.ngOnInit();
  }

  ionViewDidLoad() {
    this.loader.show_loader();
  }

  ionViewWillEnter(){
    this.profile = JSON.parse(localStorage.getItem('_info')); 
    console.log(this.profile)
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }
}
