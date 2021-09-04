import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(private firestore: AngularFirestore) { }

  createFirebase(entiti, data: any) {
    return this.firestore.collection(entiti).add(data);
  }
  getfirebase(entiti) {
    return this.firestore.collection(entiti).snapshotChanges();
  }
  updateFirebase(entiti, data: any) {
    this.firestore.doc(entiti + '/' + data.id).update(data);
  }
  getById(entiti, id) {
    return this.firestore.collection(entiti).doc(id).ref.get();
  }
  getById2(entiti, codebar) {
    return this.firestore.collection(entiti).doc(codebar).ref.get();
  }
  getByCodebar(entiti, data: String) {
    return this.firestore.collection('sales', ref => ref.where('codebar', '==', data)).snapshotChanges();
  }
  getBySalesByUser(entiti, data) {
    return this.firestore.collection(entiti, ref => ref.where('seller', '==', data)).snapshotChanges();
  }
  getSalesByDateAndSeller(entiti, data, data2) {
    return this.firestore.collection(entiti, ref => ref.where('seller', '==', data).where('date', '==', data2)).snapshotChanges();
  }
  getSalesByCodebarAndSeller(entiti, data, data2) {
    return this.firestore.collection(entiti, ref => ref.where('seller', '==', data).where('codebar', '==', data2)).snapshotChanges();
  }
  getSaleByIdGenerated(entiti?, col?, data?) {
    return this.firestore.collection(entiti, ref => ref.where(col, '==', data)).snapshotChanges();
  }
  //VENDORES
  getSeller() {
    return this.firestore.collection('users', ref => ref.where('type', '==', 'Vendedor')).snapshotChanges();
  }
  //CIerres
  getCloseBydateAndUser(entiti, data, data2) {
    return this.firestore.collection(entiti, ref => ref.where('user', '==', data).where('date', '==', data2)).snapshotChanges();
  }
}
