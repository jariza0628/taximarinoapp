import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { Sale } from '../models/sale.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../models/service.model';
import { Plan } from '../models/plan.model';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  formData: FormGroup;

  scannedData: any;
  searchDataValue: any;
  result: Sale;
  // DEvolucion
  total: any;
  totalAdd: number;


  services: any;
  plans: any;
  constructor(
    private fb: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private _FirebaseServiceService: FirebaseServiceService,
    public alertController: AlertController

  ) {

  }

  ngOnInit() {
    this.ionViewWillEnter();
  }
  ionViewWillEnter() {
    this.result = {
      name: "",
      detail: [],
      plans: [],
      dni: null,
      date: null,
      dicount: null,
      seller: null,
      state: null,
      value: null,
      agency: null,
      citylife: null,
      codebar: null
    }
    this.getDataServices();
    this.getPlans();
    this.totalAdd = 0;
  }


  ionViewWillLeave() {
    this.totalAdd = 0;
    this.searchDataValue = null;
    this.result = {
      name: "",
      detail: [],
      plans: [],
      dni: null,
      date: null,
      dicount: null,
      seller: null,
      state: null,
      value: null,
      agency: null,
      citylife: null,
      codebar: null,
      total: null
    }
  }

  searchByCode() {
    this.totalAdd = 0;
    let info;
    if (this.searchDataValue) {
      this._FirebaseServiceService.getByCodebar('sales', this.searchDataValue).subscribe(
        data => {
          console.log('data', data);
          
          info = data.map(e => {
            console.log(e.payload.doc.data());
            this.datas(e.payload.doc.data());
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
            } as any;
          });
        },
        err => {
          console.log(err);
        }
      )
    }else{
      console.log('No code');
      
    }

  }
  
  removeItemFromArr(item) {
    let i;
    i = this.result.detail.indexOf(item);

    if (i !== -1) {
      this.result.detail.splice(i, 1);
      this.totalAdd = this.totalAdd - item.publicvalue;
    }
  }

  removeItemFromArrPlan(item: any) {
    console.log(item);

    let i;
    i = this.result.plans.indexOf(item);

    if (i !== -1) {
      this.result.plans.splice(i, 1);
      this.totalAdd = this.totalAdd - item.totalvalue;
    }
  }

  onChange(deviceValue) {
    console.log(deviceValue.detail.value);
    this.addValueToArraySelect(deviceValue.detail.value);
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
    this.totalAdd = this.totalAdd + data.publicvalue;
    this.result.detail.push(data);
    console.log(this.result);
  }

  onChangePlan(deviceValue) {
    console.log(deviceValue.detail.value);
    this.addValueToArraySelectPlan(deviceValue.detail.value);
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
    this.totalAdd = this.totalAdd + data.totalvalue;
    this.result.plans.push(data);
    console.log(this.result);
  }
  sendEditSales() {
    if (this.totalAdd > 0) {
      this.presentAlert('Alerta ', 'El usuario debe cancelar un adicional de: $' + this.totalAdd)
    }
    if (this.totalAdd < 0) {
      this.presentAlert('Alerta ', 'Se debe rembolsar al usuario: $' + this.totalAdd)
    }
    this.result.total = this.result.total + this.totalAdd;
    console.log('sendEditSales', this.result);
    this._FirebaseServiceService.updateFirebase('sales', this.result);
    this.totalAdd = 0;
  }
  updateStateService() {
    console.log('Update');
    this._FirebaseServiceService.updateFirebase('sales', this.result);
  }
  datas(data) {
    this.result = data;
    console.log('datassss', this.result);
    this.total = data.total;
  }

  show() {
    console.log('show', this.result);

  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        // alert('Barcode data ' + JSON.stringify(barcodeData));
        // this.scannedData = barcodeData.text;


        this.searchDataValue = barcodeData.text;

      })
      .catch(err => {
        console.log('Error', err);
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
  getPlans() {
    this._FirebaseServiceService.getfirebase('plan').subscribe(
      data => {
        // console.log('dara', data);
        this.plans = data.map(e => {
          console.log(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Plan;
        });
      });
  }
  async presentAlert(title, msj) {
    const alert = await this.alertController.create({
      header: title,
      message: msj,
      buttons: ['OK']
    });
    alert.present();
  }
  clear(){
    this.result = {
      name: "",
      detail: [],
      plans: [],
      dni: null,
      date: null,
      dicount: null,
      seller: null,
      state: null,
      value: null,
      agency: null,
      citylife: null,
      codebar: null
    }
    this.totalAdd = 0;
  }
}
