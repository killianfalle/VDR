import { Component,
         OnInit,
         Pipe } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams } from 'ionic-angular';
import { LoaderComponent } from '../../components/loader/loader';
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

  product: any = {};

  sizes: any = [];
  quantities: any = [];

  steps: any = 1;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private provider: DataProvider,
    public loader: LoaderComponent
  ) {
    this.customer = navParams.get('customer');
    this.user = JSON.parse(localStorage.getItem('_info'));
    this.initForm();
  }

  initForm() {
  	this.form = {
      id: null,
  		class : { id : '', name: ''},
  		size: { id : '', name: ''},
      qty_type: { id : '', name: ''},
      quantity: null,
      price: null,
      total: null
  	}
  }

  ngOnInit() {
    this.provider.getData('','product').then((res: any) => {
      this.product = res._data;
      this.quantities = this.product.quantity;
      this.form.id = res._data.id;
    });
  }

  select_class(_class,_size) {
    this.form.class.id = _class.id;
    this.form.class.name = _class.name;
    this.sizes = _size;

    setTimeout(() => {
      this.onPage();
    },300)
  }

  select_size(_size) {
    this.form.size.id = _size.id;
    this.form.size.name = _size.name;

    setTimeout(() => {
      this.onPage();
    },300)
  }

  select_qty(_qty) {
    this.form.qty_type.id = _qty.id;
    this.form.qty_type.name = _qty.name;

    console.log(this.form);
  }

  setTotal() {
    if(this.form.price != 0 && this.form.quantity != 0)
      this.form.total = parseFloat(this.form.price) * parseFloat(this.form.quantity);
    if(this.form.price == 0 || this.form.quantity == 0)
      this.form.total = null;
  }

  submit() {
    this.form.customer = this.customer.id;
    this.form.transacted_by = this.user.id;

    this.provider.postData(this.form,'transaction/entry').then((res: any) => {
      if(res._data.status){
        console.log(res._data.message);
        this.navCtrl.pop();
      }
    });
  }

  onPage(page = 'next') {
    if(page == 'next')
      this.steps += 1;
    else
      this.steps -= 1;
  }

  preview(){
    this.navCtrl.push('ReviewEntryPage', { data : this.form });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}