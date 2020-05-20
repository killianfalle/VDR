import { Component } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams } from 'ionic-angular';
import { Validators,
         FormBuilder, 
         FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data-provider';
import { LoaderComponent } from '../../components/loader/loader';
import { ToastComponent } from '../../components/toast/toast';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { OneSignal } from '@ionic-native/onesignal';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: FormGroup;
  logout:any = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public provider: DataProvider,
    private form: FormBuilder,
    public toast: ToastComponent,
    public loader: LoaderComponent,
    public oneSignal: OneSignal,
    private sqliteDB: SQLite
  ) {
    this.logout = navParams.get('logout');
    this.initForm();
    this.onLogout();
    this.checkRememberUser();
  }

  initForm() {
    this.user = this.form.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [null],
    });
  }

  onLogout(){
    if(this.logout){
      this.toast.presentToast('Successfully logout');
      this.user.controls['email'].setValue(this.navParams.get('email'));
    }
  }

  sign_in() {
    if(this.user.valid){
        this.loader.show_loader('auth');

        this.provider.postData(this.user.value,'login').then((res: any) => {
            if(res._data.status){
              localStorage.setItem('_info',JSON.stringify(res._data.info));
              localStorage.setItem('_token',res._data.token);

              if(this.user.value.remember)
                this.Authenticated();
              else
                this.unRememberUser();

              setTimeout(() => {
                console.log('res', res._data);
                this.navCtrl.setRoot('TabsPage');
              },300);

              this.loader.hide_loader();
            }
        }).catch((error) => {
          console.log(error);
          this.toast.presentToast(JSON.parse(error._body).error.message);
          this.loader.hide_loader();
        })
    }
  }

  Authenticated(){
    this.sqliteDB.create({
      name: 'vdr.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM Authenticated WHERE email="'+this.user.value.email+'" LIMIT 1')
        .then((data) => {
          console.log(data)
          if(data.rows.length == 0){
             db.executeSql('INSERT INTO Authenticated(email,password,remember) VALUES(?,?,?)',[this.user.value.email,this.user.value.password,this.user.value.remember])
               .then((data) => {
                console.log("Authenticated")
                console.log(data)
              })
               .catch(e => console.log(e));
          }
        }).catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }

  checkRememberUser(){
    this.sqliteDB.create({
      name: 'vdr.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM Authenticated WHERE email="'+this.user.value.email+'" LIMIT 1')
        .then((data) => {
          if(data.rows.length > 0){
             this.user.controls['password'].setValue(data.rows.item(0).password);
             this.user.controls['remember'].setValue(data.rows.item(0).remember);
          }
        }).catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }

  unRememberUser(){
    this.sqliteDB.create({
      name: 'vdr.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM Authenticated WHERE email="'+this.user.value.email+'" LIMIT 1')
        .then((data) => {
           if(data.rows.length > 0){
             db.executeSql('DELETE FROM Authenticated WHERE email="'+this.user.value.email+'"')
               .then((data) => {
                  console.log("unremembered");
               }).catch(e => console.log(e));
           }
        }).catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loader.show_loader();
  }

  ionViewDidEnter() {
    this.loader.hide_loader();
  }

}
