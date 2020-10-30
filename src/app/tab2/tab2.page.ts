import { Component, OnInit } from "@angular/core";
import { FirebaseServiceService } from "../services/firebase-service.service";
import { Sale } from "../models/sale.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page implements OnInit {
  data: any;
  datat: any[];
  codebar: any;
  currentUser: any;
  formData: FormGroup;
  date: any;

  codeunic: string;

  dates: any;
  dateString: any;
  hours: any;
  constructor(
    private fb: FormBuilder,
    private _FirebaseServiceService: FirebaseServiceService
  ) {
    this.datat = [];
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.dates = new Date();

    this.dateString =
      this.dates.getFullYear() +
      "-" +
      this.appendLeadingZeroes(this.dates.getMonth() + 1) +
      "-" +
      this.appendLeadingZeroes(this.dates.getDate());
    this.hours =
      this.dates.getHours() +
      ":" +
      this.dates.getMinutes() +
      ":" +
      this.dates.getSeconds();

    console.log("this.dateString", this.dateString);

    this.datat = [];
    this.currentUser = JSON.parse(sessionStorage.getItem("user"));
    this.getSalesByUser(this.currentUser.user);
  }
  ionViewWillLeave() {
    // this.datat = [];
  }
  /**
   * init
   */

  submit() {
    let formValue;
    formValue = {
      date: this.date,
    };
    this.data = [];
    console.log("formValue", formValue, this.currentUser.user);
    this._FirebaseServiceService
      .getSalesByDateAndSeller("sales", this.currentUser.user, this.date)
      .subscribe((data) => {
        // console.log('dara', data);
        this.datat = data.map((e) => {
          console.log(e.payload.doc.data());
          this.datas(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as Sale;
        });
      });

    console.log("data getSalesByDateAndSeller", this.data);
  }

  getSalesByUser(userName) {
    console.log("entro where");
    this._FirebaseServiceService
      .getSalesByDateAndSeller("sales", userName, this.dateString)
      .subscribe((data) => {
        // console.log('dara', data);
        this.data = data.map((e) => {
          console.log(e.payload.doc.data());
          this.datas(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as Sale;
        });
      });
    console.log("data", this.data);
  }
  submitCodeunit() {
    // getSalesByCodebarAndSeller
    this._FirebaseServiceService
      .getSalesByCodebarAndSeller(
        "sales",
        this.currentUser.user,
        this.codeunic + ""
      )
      .subscribe((data) => {
        // console.log('dara', data);
        this.data = data.map((e) => {
          console.log(e.payload.doc.data());
          this.datas(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as Sale;
        });
      });
    console.log("data", this.data);
  }
  datas(data) {
    this.datat = [];
    console.log("datassss", data);
    this.datat.push(data);
    this.datat.sort((a, b) => parseInt(a.codebar) - parseInt(b.codebar));
  }
  doRefresh(event) {
    this.datat = [];

    console.log("Begin async operation");
    this.currentUser = JSON.parse(sessionStorage.getItem("user"));
    this.getSalesByUser(this.currentUser.user);

    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }
}
