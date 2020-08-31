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

  SalesSucces: Array<any>;
  SalesNoSucces: Array<any>;

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

    this.SalesSucces = [];
    this.SalesNoSucces = [];


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
        debugger
        this.scannedData.forEach(element => {
          this.onSubmit1(element);
          console.log('element', element);
        });
        setTimeout(() => {
          // somecode
          if (this.SalesNoSucces.length > 0) {
            this.presentAlert('Codigos No insertados',
              'Los suigientes códigos de barra ya posen ventas registradas: ' + JSON.stringify(this.SalesNoSucces));
          }
          if (this.SalesSucces.length > 0) {
            this.presentAlert('Venta creada', 'Se registraron las ventas de lo siguientes codigos: ' + JSON.stringify(this.SalesSucces));
          }
        }, 600);
        this.scannedData = [];
      } else {
        this.presentAlert('Campos obligatorios', 'Debe indicar un código de barra');
      }
    } else {
      this.presentAlert('Campos obligatorios', 'Seleccione por lo menos un plan o un servicio a la venta');

    }

  }

  getSalesByCode(code) {
    console.log('entro where');

  }

  onSubmit1(code) {
    let formValue;
    let body;

    let result;

    this._FirebaseServiceService.getByCodebar('sales', code).subscribe(
      data => {
        // console.log('dara', data);

        if (data.length > 0) {
          debugger
          this.SalesNoSucces.push(code);
          console.log('No Duplicados', code);
        }
        else {
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
              if (formValue.seller === null || formValue.seller === '') {
                formValue.seller = this.currentUser.user;
              }
              if (formValue.dicount === null || formValue.dicount === '') {
                formValue.dicount = 0;
              }
              body = {
                id: '0',
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
              this.SalesSucces.push(code);
              this.loadDataUser();
            } else {
              this.presentAlert('Campos obligatorios', 'Debe indicar un código de barra');
            }
          } else {
            this.presentAlert('Campos obligatorios', 'Seleccione por lo menos un plan o un servicio a la venta');
          }
        }

      });
  }
  async save(body) {
    console.log('save body', body);
    if (body) {
      this._FirebaseServiceService.createFirebase('sales', body);
    } else {
      console.log('err send body');
    }
    setTimeout(() => {
      this.total = 0;
      this.totalValue = 0;
      this.arraySelectPlan = [];
      this.arraySelect = [];
      this.scannedData = [];
      this.SalesNoSucces = [];
      this.SalesSucces = [];

      // this.resetForm();
    }, 1000);
  }

  resetForm() {
    this.formData.setValue({
      name: '',
      dni: '',
      seller: this.currentUser.user,
      codebar: null,
      detail: '',
      host: '',
      dicount: '',
      service: '',
      zone: '',
      citylife: '',
      phone: ''
    });
    this.scannedData = [];
    this.pointsale = [];
    this.arraySelect = [];
  }

  loadDataUser() {

    this.currentUser = JSON.parse(sessionStorage.getItem('user'));
    console.log('loadDataUser', this.currentUser);
    /*
    this.formData.setValue({
      name: '',
      dni: '',
      seller: this.currentUser.user,
      codebar: null,
      detail: '',
      host: '',
      dicount: '',
      service: '',
      zone: '',
      citylife: '',
  

    });*/
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
  addRangeCodes() {
    let showrange;
    if (localStorage.getItem('ShowMessageRanges')) {
      showrange = localStorage.getItem('ShowMessageRanges');
      if (showrange === 'false') {
        this.presentAlertConfirmMesaje()
      } else {
        this.presentAlertConfirm();
      }
    } else {
      this.presentAlertConfirmMesaje()
    }
  }
  async presentAlertConfirmMesaje() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Importante!',
      message: 'Esta opción permite generar consecutivos automanticamente, debes tener en cuenta que debes tener dispoble fisicamente todas las manillas',

      inputs: [
        {
          name: 'name1',
          type: 'checkbox',
          label: 'No volver a mostrar este mensaje',
          checked: false,
          value: 'value1'
        }
      ],
      buttons: [
        {
          text: 'Continuar',
          handler: (result) => {
            console.log('Confirm Okay', result);
            if (result[0] === 'value1') {
              localStorage.setItem('ShowMessageRanges', 'true')
            } else {
              localStorage.setItem('ShowMessageRanges', 'false')
            }
            this.presentAlertConfirm();
          }
        }
      ]
    });


    await alert.present();
  }
  async presentAlertConfirm() {
    let rango1, rango2;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Indique el rango!',
      inputs: [
        {
          name: 'name1',
          type: 'number',
          placeholder: '202010000',
          min: -0,

        },
        {
          min: -0,
          name: 'name2',
          type: 'number',
          placeholder: '202010050'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Generar',
          handler: (data) => {
            console.log('Confirm Okay', data.name1);
            rango1 = parseInt(data.name1);
            rango2 = parseInt(data.name2);
            if (rango1 < rango2) {
              for (let index = rango1; index <= rango2; index++) {
                this.addCodeRonge(index);
              }
            }
          }
        }
      ]
    });


    await alert.present();
  }



  removeItemFromArr(item) {

    let i;
    i = this.arraySelect.indexOf(item);

    if (i !== -1) {
      this.arraySelect.splice(i, 1);
      this.total = this.total - item.totalvalue;

    }
  }
  removeItemFromArrCodeBar(item) {
    let i;
    i = this.scannedData.indexOf(item);

    if (i !== -1) {
      this.scannedData.splice(i, 1);

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
  addCodeManula() {
    //       let formValue = this._formEntity.value;
    if (this.formData.controls.codebar.value) {
      let codeDuplicate = false;
      this.scannedData.forEach(element => {
        if (element === this.formData.controls.codebar.value) {
          codeDuplicate = true;
        }

      });
      if (!codeDuplicate) {
        this.scannedData.push(this.formData.controls.codebar.value);

      } else {
        this.presentAlert('Alerta', 'El codigo que intenta registra ya fue añadido!');
      }
    } else {
      this.presentAlert('Alerta', 'Digite un codigo de barra!');
      console.log('Code', this.formData.controls.codebar.value);

    }

  }
  addCodeRonge(code) {
    //       let formValue = this._formEntity.value;
    if (code) {
      let codeDuplicate = false;
      this.scannedData.forEach(element => {
        if (element === code) {
          codeDuplicate = true;
        }

      });
      if (!codeDuplicate) {
        this.scannedData.push(code);

      } else {
        this.presentAlert('Alerta', 'El codigo que intenta registra ya fue añadido!');
      }
    } else {
      this.presentAlert('Alerta', 'Digite un codigo de barra!');
      console.log('Code', code);

    }

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
