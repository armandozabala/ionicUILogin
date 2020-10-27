import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  public usersShow:any = {};

  userChange: Subject<any> = new Subject<any>()

  constructor(public db: AngularFirestore, private router: Router) {
     
   /*  this.userChange.subscribe((value) => {
        alert(value);
        this.usersShow = value;
    });*/
  }


  createUserUID(user: any) {

    return this.db.collection("users").doc(user.uid).set(user);
    
  }


  updateRequestOrder(orderId:any, data: any) {
    return this.db.collection("orderRequest").doc(orderId).set(data, {merge: true});
  }

  //ORDERS 
  
  reportOrder(order: any) {
    return this.db.collection("orders").add(order);
  }



  getAllOrdersByDateStatus(companyId:any, userId:any, dates:any){
    return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'datedelivery','==', dates).where('driverId','==',userId)).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
        })
     ))
  }


  /***************getOrders By Driver *******************/

  getAllOrderByDriver(companyId: any, driverId: any){
  
    let now = new Date();

    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    start.setHours(0,0,0,0);

    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end.setHours(23,59,59,999);

    return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'driverId','==', driverId).orderBy("datedelivery").startAt(Number(start.getTime())).endAt(Number(end.getTime()))).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
        })
     ))

  }


  reportOrderDriver(companyId:any, orderId:any, order:any){
    return this.db.collection("companys/"+companyId+"/order").doc(orderId).set(order, {merge: true});
  }


  //*****************get ITEMS ****************/

  getAllItemsByStatus(companyId:any){
    return this.db.collection("companys/"+companyId+"/itemorders", ref => ref.where( 'status','==', "1")).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
        })
     ))
  }


  loadStorage(){

    if(localStorage.getItem('users')){
          //console.log(JSON.parse(localStorage.getItem('users')));
          this.usersShow = JSON.parse(localStorage.getItem('users'));
    }else{
          this.usersShow = {};
      }
  }


 


  saveStorage(documentId: any, dataUser: any){
 
    localStorage.setItem('id', documentId);
    localStorage.setItem('users', JSON.stringify(dataUser));
  }

    //edit user - get
    getUser(documentId: string) {
      return this.db.collection("users").doc(documentId).snapshotChanges().pipe(
        map((changes:any) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        }));
    }

      //UID
  getUserUID(uid: string) {
    return this.db.collection("users", ref=> ref.where('uid',"==",uid)).valueChanges().pipe(
      map((changes:any) => {
        this.saveStorage(changes[0].id, changes[0]);
        return true;
      }));
  }

  updateUser(uid:any, data:any) {

     return this.db.collection("users").doc(uid).set(data, {merge: true});
  }

}
