import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { User } from '../models/users.model';
import { AlertController } from '@ionic/angular';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public data: any;
  scannedData: any;

  user: any;
  password: any;

  codemanual: any;
  loginScanUser: boolean;
  userLogin: any;
  datas: any;

  messagefind: any;



  constructor(
    private barcodeScanner: BarcodeScanner,
    private router: Router,
    private firebaseServiceService: FirebaseServiceService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.loginScanUser = false;
    this.getAllUsers();
    this.getUserLogin();
  }


  getUserLogin() {
    if (sessionStorage.getItem('user')) {
      this.userLogin = JSON.parse(sessionStorage.getItem('user'));
      this.loginScanUser = true;
    }
  }
  getAllUsers() {
    this.firebaseServiceService.getfirebase('users').subscribe(
      data => {
        // console.log('dara', data);
        this.data = data.map(e => {
          console.log(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as User;
        });
      });
  }

  login() {
    let encontroUsuarios;
    let nOencontroUsuarios;
    encontroUsuarios = 0;
    nOencontroUsuarios = 0;
    if (!this.user) {
      this.presentAlert('Alerta', 'Selecciona tu usuario!');
      return;
    }
    if (!this.password) {
      this.presentAlert('Alerta', 'Digita una clave!');
      return;
    }
    console.log('data', this.password);
    this.data.forEach(element => {
      if (element.user === this.user && element.password === this.password) {
        sessionStorage.setItem('user', JSON.stringify(element));
        this.loginScanUser = true;

        encontroUsuarios = 1;
        // this.router.navigate(['/app/tabs/tab1']);
      } else {
        nOencontroUsuarios = 2;
      }
    });
    if (nOencontroUsuarios === 2 && encontroUsuarios !== 1) {
      this.alertUser();
    }

    // 
  }
  closesession() {
    this.loginScanUser = false;
    sessionStorage.removeItem('user');
  }
  alertUser() {
    this.presentAlert('Alerta', 'Usuario o clave erroneos!');
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        // alert('Barcode data ' + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
        this.goTodetail(barcodeData.text);
      })
      .catch(err => {
        console.log('Error', err);
        this.goTodetail('111111111111');

      });
  }

  onChangeTime(e) {
    console.log('e', e);
    this.getDataByCodebar(e);
  }

  goTodetail(barcode) {
    this.router.navigate(['/detail-scan', { code: barcode }]);
  }

  getDataByCodebar(code) {
    let encontro: boolean;
    encontro = false;
    console.log('entro where');
    this.firebaseServiceService.getByCodebar('sales', code).subscribe(
      data => {
        // console.log('dara', data);
        this.data = data.map(e => {
          console.log('enontro', e.payload.doc.data());
          encontro = true;
          this.messagefind = '';
          this.goTodetail(code);
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Sale;
        });
      });
    if (encontro === false) {
      console.log('No encontro');
      this.messagefind = 'Sin resultado';

    }


  }

  async presentAlert(title, messages) {
    const alert = await this.alertController.create({
      header: title,
      message: messages,
      buttons: ['OK']
    });

    await alert.present();
  }

}
