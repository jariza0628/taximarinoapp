import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Sale } from '../models/sale.model';
import { FirebaseServiceService } from '../services/firebase-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  data: any;
  datat: any;
  constructor(private router: Router, private _FirebaseServiceService: FirebaseServiceService) {
    this.datat = [];
    this.getPlans();
  }
  colse() {
    sessionStorage.removeItem('user');
    localStorage.removeItem('UserSiosionON');
    
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
}
