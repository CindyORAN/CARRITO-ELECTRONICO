
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
}) //con esto toda la aplicacion reconoce el servicio

export class FirestoreService {

  constructor(public database: AngularFirestore) { }

//CRUD DE HELADOS EL PAY

//path es la ruta en done vamos a guardar
  createDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).set(data); //se agrega un documento

  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  getDoc<tipo>(path: string, id: string){
    const collection = this.database.collection<tipo>(path);//apuntamos hacia una colleccion de datos
    return collection.doc(id).valueChanges(); //con esto leemos un documenton, nos devuelve un observable
  }

  deleteDoc(path: string, id: string){
    const collection = this.database.collection(path);//apuntamos hacia una colleccion de datos
    return collection.doc(id).delete();//eliminamos con el metodo delete
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);//apuntamos hacia una colleccion de datos
    return collection.doc(id).update(data);//actualizamos con el metodo update
  }

  getId(){
    return this.database.createId();
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  getCollection<tipo>(path: string){
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  getCollectionQuery<tipo>(path: string, parametro: string, condicion: any, busqueda: string){
    const collection = this.database.collection<tipo>(path,
      ref => ref.where( parametro, condicion, busqueda ));
    return collection.valueChanges();
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  getCollectionAll<tipo>(path, parametro: string, condicion: any, busqueda: string, startAt: any){
    if(startAt == null){
      startAt = new Date();
    }
    const collection = this.database.collectionGroup<tipo>(path,
      ref => ref.where( parametro, condicion, busqueda )
                .orderBy('fecha', 'desc')
                .limit(2) //esto es cuantos pedidos voy a traer
                .startAfter(startAt)
      );
    return collection.valueChanges();
  }

}


