import { Component,
         OnInit,
         Pipe,
         NgZone } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams,
         Events } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';
import { AlertComponent } from '../../components/alert/alert';
import { DataProvider } from '../../providers/data-provider';

/**
 * Generated class for the EntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-entry',
  templateUrl: 'order-entry.html',
})
export class OrderEntryPage implements OnInit {

  customer: any;
  user: any;
  form: any;
  productPrice: any;

  product: any = [];

  classes: any = [];
  sizes: any = [];
  quantities: any = [];

  steps: any = 0;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private provider: DataProvider,
    public loader: LoaderComponent,
    public alert: AlertComponent,
    private event: Events,
    private zone: NgZone
  ) {
    this.customer = navParams.get('customer');
    this.user = JSON.parse(localStorage.getItem('_info'));
    this.initForm();
  }

  initForm() {
    this.provider.getData('','product/list').then((res: any) => {
      if(res._data.data){
        this.product = res._data.data;
        console.log('rpdocas', this.product)
        //this.loadProducts(res._data.data);
      }
    });

  	this.form = {
      id: null,
      name: null,
  		class : { id : '', name: ''},
  		size: { id : '', name: ''},
      qty_type: { id : '', name: ''},
      quantity: null,
      price: null,
      total: null,
      customer: null,
      transacted_by: null
  	}

    this.form.customer = this.customer.id;
    this.form.transacted_by = this.user.id;
  }

  ngOnInit() {
    // this.provider.getData('','product/list').then((res: any) => {
    //   if(res._data.data){
    //     this.product = res._data.data;
    //     console.log('rpdocas', this.product)
    //     //this.loadProducts(res._data.data);
    //   }
    // });
  }

  select_product(_product,_class,_qty) {

    //DEFAULT CASH
    // this.product.forEach(product => {
    //   if(_product.id == product.id){
    //     console.log(product)
    //     this.productPrice = product.default_price
    //   }
    // });
    this.form.price = this.productPrice;
    this.form.id = _product.id;
    this.form.name = _product.name;
    this.form.class.id = _class.id;
    this.form.class.name = _class.name;
    this.sizes = _class.product_size;
    this.quantities = _qty;
    // this.form.price = _product.price
    console.log(this.form)
    console.log(this.product)
    if(this.sizes.length > 0){

      setTimeout(() => {
        this.onPage();
      },300)

    }else if(this.sizes.length == 0 && this.quantities.length > 0){
      this.steps = 2;
    }else {
      this.steps = 3;
    }
  }

  /*loadProducts(products) {
    products.map(obj => {
      obj.class.map(obj_class => {
        this.zone.run(() => {
          this.product.push({
            product: {
              'id': obj.id,
              'name': obj.name,
              'quantity': obj.quantity
            },
            class: {
              'id': obj_class.id,
              'name': obj_class.name,
              'size': obj_class.size
            }
          });
        });
      })
    });

    console.log("load product");
    console.log(this.product);
  }*/

  /*select_product(_product,_class) {
    this.form.id = _product.id;
    this.form.name = _product.name;
    this.form.class.id = _class.id;
    this.form.class.name = _class.name;
    this.sizes = _class.size;
    this.quantities = _product.quantity;

    setTimeout(() => {
      this.onPage();
    },300)
  }*/
  
  select_size(_size) {
    this.form.size.id = _size.id;
    this.form.size.name = _size.name;

    if(this.quantities.length > 0){
      setTimeout(() => {
        this.onPage();
      },300)
    }else {
      this.steps += 2;
    }

  }

  select_qty(_qty) {
    this.form.qty_type.id = _qty.id;
    this.form.qty_type.name = _qty.name;

    console.log(this.form);
    setTimeout(() => {
      this.onPage();
    },300)
  }

  setTotal() {
    if(this.form.price != 0 && this.form.quantity != 0)
      this.form.total = Math.round((parseFloat(this.form.price) * parseFloat(this.form.quantity)) * 100) / 100;
    if(this.form.price == 0 || this.form.quantity == 0)
      this.form.total = null;
  }

  submit() {
    this.alert.confirm().then(res => {
      if(res){
        console.log(this.form)
        this.provider.postData(this.form,'transaction/entry').then((res: any) => {
          console.log(res);
          if(res._data.status){
            this.event.publish('notification:badge',null,res._data.badge);
            this.navCtrl.pop();
            this.navCtrl.push('OrderEntryPage', {
              customer : this.customer
            });
          }
        });
      }
    });
  }

  onPage(page = 'next') {
    if(page == 'next'){
      this.steps += 1;
    }else{
      if(this.steps == 3 && this.quantities.length == 0 && this.steps == 3 && this.sizes.length == 0){
        this.steps = 0;
      }else if(this.sizes.length > 0 && this.quantities.length > 0){
        this.steps -= 1;
      }else if(this.steps == 3 && this.quantities.length > 0) {
        this.steps = 2;
      }else if(this.steps == 3 && this.sizes.length > 0){
        this.steps = 1;
      }else {
        this.steps -= 1;
      }
    }
  }

  preview(){
    console.log(this.form);
    this.navCtrl.push('ReviewEntryPage', { data : this.form, customer : this.customer });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}