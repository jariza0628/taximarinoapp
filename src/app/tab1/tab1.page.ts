import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Sale } from '../models/sale.model';
import { Plan } from '../models/plan.model';
import { Service } from '../models/service.model';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  formData: FormGroup;
  data: any;
  services: any;
  pointsale: any;
  total: any;
  arraySelect: any;
  arraySelectPlan: any;
  public totalValue: number;

  scannedData: any;

  currentUser: any;

  efecty: any;
  tarjeta: any;
  typepay: any;



  constructor(private fb: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private _FirebaseServiceService: FirebaseServiceService,
    public alertController: AlertController) {
    this.arraySelect = [];
    this.arraySelectPlan = [];

    this.scannedData = [];

    this.formData = fb.group({
      name: fb.control(''),
      dni: fb.control(''),
      host: fb.control(''),
      citylife: fb.control(''),
      phone: fb.control(''),
      seller: fb.control('', Validators.required),
      codebar: fb.control(null, Validators.required),
      detail: fb.control('', Validators.required),
      dicount: fb.control(0),
      service: fb.control(0),
      zone: fb.control(null, Validators.required),
    });
    this.totalValue = 0;
    this.total = 0;

  }

  ngOnInit() {
    this.getData();
    this.getDataServices();
    this.getDataZones();
    setTimeout(() => {
      this.loadDataUser();
      this.presentAlertRadio();
    }, 400);


  }

  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  sendNewSales() {

    if (this.arraySelectPlan.length > 0 || this.arraySelect.length > 0) {
      if (this.scannedData.length > 0) {
        this.scannedData.forEach(element => {
          this.onSubmit1(element);
          console.log('element', element);
        });
        this.scannedData = [];
      } else {
        this.presentAlert('Campos obligatorios', 'Debe indicar un código de barra');
      }
    } else {
      this.presentAlert('Campos obligatorios', 'Seleccione por lo menos un plan o un servicio a la venta');

    }

  }

  onSubmit1(code) {
    let formValue;
    let body;

    let dates = new Date();
    let dateString, hours;
    dateString = dates.getFullYear() + "-" + this.appendLeadingZeroes(dates.getMonth() + 1) + "-" + this.appendLeadingZeroes(dates.getDate());
    hours = dates.getHours() + ":" + dates.getMinutes() + ":" + dates.getSeconds();
    formValue = this.formData.value;
    delete formValue.detail;

    if (this.arraySelectPlan.length > 0 || this.arraySelect.length > 0) {

      if (code) {
        formValue.codebar = code;
      } else {
        this.presentAlert('Campos obligatorios', 'Seleccione por lo menos un plan o un servicio a la venta');

      }
      if (formValue.codebar !== null) {
        body = {
          ...formValue,
          plans: this.arraySelectPlan,
          detail: this.arraySelect,
          date: dateString, hour: hours,
          total: this.total,
          state: 'Activo',
          efecty: this.total,
          tarjeta: 0,
          typepay: 'Efectivo',
        };
        this.save(body);
        console.log('body', body);

        this.presentAlert('Venta creada', 'Su venta a sido registrada');

        this.total = 0;
        this.totalValue = 0;
        this.arraySelectPlan = [];
        this.arraySelect = [];
        this.scannedData = [];
        this.formData.reset();
        this.loadDataUser();
      } else {
        this.presentAlert('Campos obligatorios', 'Debe indicar un código de barra');

      }
    } else {
      this.presentAlert('Campos obligatorios', 'Seleccione por lo menos un plan o un servicio a la venta');
    }
  }
  async save(body) {
    this._FirebaseServiceService.createFirebase('sales', body);
  }


  loadDataUser() {

    this.currentUser = JSON.parse(sessionStorage.getItem('user'));
    console.log('loadDataUser', this.currentUser);

    this.formData.setValue({
      name: '',
      dni: '',
      seller: this.currentUser.user,
      codebar: null,
      detail: '',
      dicount: '',
      service: '',
      zone: '',
    });
  }

  calcValue(val) {
    this.totalValue = this.totalValue + val;
  }

  /**
   * Get data para la ventas
   */

  getPlans() {
    this._FirebaseServiceService.getfirebase('plan').subscribe(
      (data: any) => {
        console.log(data.doc.data());
      },
      err => {
        console.log(err);
      }
    );
  }

  getData() {
    this._FirebaseServiceService.getfirebase('plan').subscribe(
      data => {
        // console.log('dara', data);
        this.data = data.map(e => {
          console.log(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Plan;
        });
      });
  }

  getDataServices() {
    this._FirebaseServiceService.getfirebase('service').subscribe(
      data => {
        // console.log('dara', data);
        this.services = data.map(e => {
          console.log(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Service;
        });
      });
  }

  getDataZones() {
    this._FirebaseServiceService.getfirebase('pointsale').subscribe(
      data => {
        // console.log('dara', data);
        this.pointsale = data.map(e => {
          console.log('Zone', e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as any;
        });
      });
  }

  onChange(deviceValue) {
    console.log(deviceValue.detail.value);
    this.addValueToArraySelect(deviceValue.detail.value);
  }

  onChangePlan(deviceValue) {
    console.log(deviceValue.detail.value);
    this.addValueToArraySelectPlan(deviceValue.detail.value);
  }

  getRecDet(deviceValue: any) {
    console.log(deviceValue);
    this.addValueToArraySelect(deviceValue);
  }

  addValueToArraySelect(item) {

    this._FirebaseServiceService.getById('service', item).then(
      datas => {
        console.log('datas', datas.data());
        this.ps(datas.data());
      }, err => {
        console.log(err);
      }
    );
  }
  ps(data) {
    this.totalValue = this.totalValue + data.publicvalue;
    this.arraySelect.push(data);
    console.log(this.arraySelect);
  }


  removeItemFromArr(item) {

    let i;
    i = this.arraySelect.indexOf(item);

    if (i !== -1) {
      this.arraySelect.splice(i, 1);
      this.total = this.total - item.totalvalue;

    }
  }
  /***
   * Planes opciones
   */
  getRecDetPlan(deviceValue: any) {
    console.log(deviceValue);
    this.addValueToArraySelect(deviceValue);
  }

  addValueToArraySelectPlan(item) {

    this._FirebaseServiceService.getById('plan', item).then(
      datas => {
        console.log('datas', datas.data());
        this.psPlan(datas.data());
      }, err => {
        console.log(err);
      }
    );
  }
  psPlan(data) {
    this.total = data.totalvalue;
    this.arraySelectPlan.push(data);
    console.log(this.arraySelectPlan);
  }


  removeItemFromArrPlan(item: any) {
    console.log(item);

    let i;
    i = this.arraySelectPlan.indexOf(item);

    if (i !== -1) {
      this.arraySelectPlan.splice(i, 1);
      this.total = this.total - item.totalvalue;
    }
  }

  async presentAlert(title, msj) {
    const alert = await this.alertController.create({
      header: title,
      message: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        // alert('Barcode data ' + JSON.stringify(barcodeData));
        sessionStorage.setItem('barcode', JSON.stringify(barcodeData));
        // this.scannedData = barcodeData.text;
        let codeDuplicate = false;
        this.scannedData.forEach(element => {
          if (element === barcodeData.text) {
            codeDuplicate = true;
          }

        });
        if (!codeDuplicate) {
          this.scannedData.push(barcodeData.text);
        } else {
          this.presentAlert('Alerta', 'El codigo que intenta registra ya fue añadido!');
        }
      })
      .catch(err => {
        console.log('Error', err);
      });
    this.formData.setValue({
      codebar: this.scannedData
    });
  }

  async presentAlertRadio() {
    console.log('alert');

    let zones: any;
    zones = [];
    let i = 0;
    this.pointsale.forEach(element => {
      zones.push(
        {
          name: 'radio' + i,
          type: 'radio',
          label: element.name,
          value: element.name
        }
      );
      i = i++;
    });
    const alert = await this.alertController.create({
      header: 'Indica Zona de venta',
      inputs: [zones],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }








}
