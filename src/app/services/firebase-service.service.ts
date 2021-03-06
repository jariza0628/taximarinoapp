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
  getByCodebar(entiti, data) {
    return this.firestore.collection(entiti, ref => ref.where('codebar', '==', data)).snapshotChanges();
  }
  getBySalesByUser(entiti, data) {
    return this.firestore.collection(entiti, ref => ref.where('seller', '==', data)).snapshotChanges();
  }
}
