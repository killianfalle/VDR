import { Component,
         OnInit,
         Pipe } from '@angular/core';
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
    private event: Events
  ) {
    this.customer = navParams.get('customer');
    this.user = JSON.parse(localStorage.getItem('_info'));
    this.initForm();
  }

  initForm() {
  	this.form = {
      id: null,
      name: null,
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
      if(res._data.data){
        this.product = res._data.data;
      }
    });
  }

  select_product(_data) {
    this.form.id = _data.id;
    this.form.name = _data.name;
    this.classes = _data.class;
    this.quantities = _data.quantity;

    setTimeout(() => {
      this.onPage();
    },300)
  }

  select_class(_class) {
    this.form.class.id = _class.id;
    this.form.class.name = _class.name;
    this.sizes = _class.size;

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
      this.form.total = Math.round((parseFloat(this.form.price) * parseFloat(this.form.quantity)) * 100) / 100;
    if(this.form.price == 0 || this.form.quantity == 0)
      this.form.total = null;
  }

  submit() {
    this.form.customer = this.customer.id;
    this.form.transacted_by = this.user.id;

    this.alert.confirm().then(res => {
      if(res){
        this.provider.postData(this.form,'transaction/entry').then((res: any) => {
          if(res._data.status){
            this.event.publish('notification:badge',null,res._data.badge);
            this.navCtrl.pop();
          }
        });
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