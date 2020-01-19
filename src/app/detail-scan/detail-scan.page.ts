import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Sale } from '../models/sale.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-scan',
  templateUrl: './detail-scan.page.html',
  styleUrls: ['./detail-scan.page.scss'],
})
export class DetailScanPage implements OnInit {
  data: any;
  datat: any;
  codebar: any;

  constructor(private _FirebaseServiceService: FirebaseServiceService, private activatedRoute: ActivatedRoute) {
    this.data = [];
    this.datat = [];

  }

  ngOnInit() {
    this.codebar = this.activatedRoute.snapshot.params.code; // user id
    console.log('code:, ', this.codebar);

    this.getDataByCodebar(this.codebar);
  }


  getDataByCodebar(code) {
    console.log('entro where');
    this._FirebaseServiceService.getByCodebar('sales', code).subscribe(
      data => {
        // console.log('dara', data);
        this.data = data.map(e => {
          console.log(e.payload.doc.data());
          this.datas(e.payload.doc.data(), e.payload.doc.id);
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Sale;
        });
      });

    console.log('data', this.data);

  }
  datas(data, ids) {
    console.log('datassss', data);
    this.datat = data;
    this.datat = { ... this.datat, id: ids };
  }

  updateArrayServiceIndividual(i) {
    this.datat.detail[i].status = 'Usado';
    console.log('updateArrayServiceIndividual', this.datat);
    this.updateStateService();
  }
  updateArrayPlan(i1, i) {
    this.datat.plans[i1].services[i].status = 'Usado';
    console.log('updateArrayServiceIndividual', this.datat);
    this.updateStateService();
  }

  updateStateService() {
    console.log('Update');
    this._FirebaseServiceService.updateFirebase('sales', this.datat);
  }



}
