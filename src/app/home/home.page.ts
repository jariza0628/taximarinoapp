import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { User } from '../models/users.model';
import { AlertController } from '@ionic/angular';

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




  constructor(
    private barcodeScanner: BarcodeScanner,
    private router: Router,
    private firebaseServiceService: FirebaseServiceService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.getAllUsers();
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
        encontroUsuarios = 1;
        this.router.navigate(['/app/tabs/tab1']);
      } else {
        nOencontroUsuarios = 2;
      }
    });
    if (nOencontroUsuarios === 2 && encontroUsuarios !== 1) {
      this.alertUser();
    }

    // 
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
    this.goTodetail(e);


  }

  goTodetail(barcode) {
    this.router.navigate(['/detail-scan', { code: barcode }]);
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
