import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseServiceService } from '../services/firebase-service.service';

@Component({
  selector: 'app-modal-close',
  templateUrl: './modal-close.page.html',
  styleUrls: ['./modal-close.page.scss'],
})
export class ModalClosePage implements OnInit {
  formData: FormGroup;
   dateString: any;
    hours: any;
    currentUser:any
  @Input() data: string;

  constructor(
    private fb: FormBuilder,
    private _FirebaseServiceService: FirebaseServiceService,
    public toastController: ToastController,
    public modalController: ModalController

  ) { 
    this.getUser();

  }

  ngOnInit() {
    this.getUser();
    this.getdate();
    this.initForm();
  }

  initForm(){
    this.getUser();

    if(this.data){

    }else{
      this.formData = this.fb.group({
        user: this.fb.control(this.currentUser.user,Validators.required),
        idUser: this.fb.control(this.currentUser.id,Validators.required),
        efecty: this.fb.control("",[Validators.required, Validators.min(0)]),
        dataphone: this.fb.control("",[Validators.required, Validators.min(0)]),
        vaucherAgency: this.fb.control("",[Validators.required, Validators.min(0)]),
        buyGeneral: this.fb.control("",[Validators.required, Validators.min(0)]),
        totalComisions: this.fb.control("",[Validators.required, Validators.min(0)]),
        totalPromo: this.fb.control("",[Validators.required, Validators.min(0)]),
        totalReturn: this.fb.control("",[Validators.required, Validators.min(0)]),
        totalDelivery: this.fb.control("",[Validators.required, Validators.min(0)]),
        handlesBuy: this.fb.control("", [Validators.required, Validators.min(1)]),
        handles: this.fb.control("", [Validators.required, Validators.min(1)]),
        zone: this.fb.control("", [Validators.required]),

      });
    }
  }
  sendClose(){
    console.log(this.formData);
    
  }
  save(){
    this.getdate();
    let formValue;
    formValue = this.formData.value;
    console.log('formValue',formValue);
    let sum = formValue.efecty + formValue.dataphone
    if(sum !=  formValue.buyGeneral){
      this.presentToast("El valor de efectivo y datafono no coinciden, la suma debe ser: $" + sum);
      return false
    }
    formValue = {
      ... formValue,
      date: this.dateString,
      hour: this.hours
    }
    if (formValue && this.formData.valid) {
      
      this._FirebaseServiceService
        .createFirebase("close", formValue)
        .then((data) => {
          console.log("then data", data);
          this.presentToast("Datos guardados");
        });
        this.initForm();
    } else {
      console.log("err send body");
      this.presentToast("Error, verificar los datos enviados.");
    }
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

  async presentToast(msj) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 5000,
    });
    toast.present();
  }
  getUser(){
    this.currentUser = JSON.parse(sessionStorage.getItem('user'));
  }

  closemodal(){
    this.modalController.dismiss()
  }
}

