import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  data: any;
  datat: any[];
  codebar: any;
  currentUser: any;

  constructor(private _FirebaseServiceService: FirebaseServiceService) {
    this.datat = [];
  }

  ngOnInit() {
    

  }
  ionViewWillEnter(){
    this.datat = [];
    this.currentUser = JSON.parse(sessionStorage.getItem('user'));
    this.getSalesByUser(this.currentUser.user);
  }
  ionViewWillLeave() {
    // this.datat = [];
  }


  getSalesByUser(userName) {
    console.log('entro where');
    this._FirebaseServiceService.getBySalesByUser('sales', userName).subscribe(
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
  doRefresh(event) {
    this.datat = [];

    console.log('Begin async operation');
    this.currentUser = JSON.parse(sessionStorage.getItem('user'));
    this.getSalesByUser(this.currentUser.user);
  
     setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }



}
