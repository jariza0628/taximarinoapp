import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalClosePage } from '../modal-close/modal-close.page';
import { Close } from '../models/close.model';
import { Sale } from '../models/sale.model';
import { FirebaseServiceService } from '../services/firebase-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  data: any;
  dataClose: any;
  datat: any;
  datatClose: Array<any>;
  tabSelected: any;
  currentUser:any;
  dateString: any;
  hours: any;

  constructor(private router: Router, private _FirebaseServiceService: FirebaseServiceService, public modalController: ModalController) {

    this.getUser();
    this.getdate();
 
    this.tabSelected = 'Cierres';
   }

  ngOnInit() {
    this.datat = [];
    this.datatClose = [];
    this.getUser();
    this.getdate();
    this.getPlans();
    this.getClose(this.dateString);
   }
  colse() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getPlans() {
    console.log('entro where');
    this._FirebaseServiceService.getfirebase('plan').subscribe(
      data => {
        // console.log('dara', data);
        this.data = data.map(e => {
          console.log(e.payload.doc.data());
          this.datas(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Sale;
        });
      });

    console.log('data', this.data);

  }
  datas(data) {
    console.log('datassss', data);

    this.datat.push(data);
  }
  datasClose(data: any) {
    console.log('datasClose', data);

    this.datatClose.push(data)
    this.datatClose = JSON.parse(JSON.stringify(this.datatClose))
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.tabSelected =  ev.detail.value
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalClosePage,
      cssClass: 'my-custom-class',
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      }
    });
    return await modal.present();
  }
  async openModalData(data){
    const modal = await this.modalController.create({
      component: ModalClosePage,
      cssClass: 'my-custom-class',
      componentProps: {
        'data': data ,
         
      }
    });
    return await modal.present();
  }

  getClose(date?) {
    this.datatClose = [];
    this.getUser();
    console.log('entro wheregetClose');
    this._FirebaseServiceService.getCloseBydateAndUser("close",this.currentUser.user,date).subscribe(
      data => {
        // console.log('dara', data);
        this.dataClose = data.map(e => {
          console.log(e.payload.doc.data());
          this.datasClose(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as any;
        });
      }
      ,err =>{
        console.log(err);
        
      }
      );

    console.log('data', this.dataClose);

  }

  getUser(){
    this.currentUser = JSON.parse(sessionStorage.getItem('user'));
  }

  getdate(){
    let dates = new Date();
         
          this.dateString =
            dates.getFullYear() +
            "-" +
            this.appendLeadingZeroes(dates.getMonth() + 1) +
            "-" +
            this.appendLeadingZeroes(dates.getDate());
          this.hours =
            dates.getHours() +
            ":" +
            dates.getMinutes() +
            ":" +
            dates.getSeconds();
  }
  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }
}
