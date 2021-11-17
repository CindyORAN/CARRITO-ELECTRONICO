
import { Producto } from './../../models';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirestorageService } from 'src/app/services/firestorage.service';


@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})

export class SetProductosComponent implements OnInit {

  productos: Producto[] = [];

  newProducto: Producto;

  enableNewProducto = false;

  private path = 'Productos/'; //SI NO AGARRA INTENTO HACERLO PUBLICO

  // eslint-disable-next-line @typescript-eslint/member-ordering
  newImage = '';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  newFile: any; //CHECAR ESTE ERROR PORQUE AQUI TENIA CADENA Y NO COMO ANY

  // eslint-disable-next-line @typescript-eslint/member-ordering
  loading: any;

  //esto nos permitirá controlar todos los menus que hay en la aplicación
  constructor(public menuControler: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getProductos();
  }

  openMenu(){
    console.log('open menu');
    this.menuControler.toggle('principal');
  }

  async guardarProducto(){ //luego le damos una respuesta con res
    this.presentLoading();

    const path = 'Productos';
    const name = this.newProducto.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.newProducto.foto = res;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then( res=>{
        this.loading.dismiss();
        this.presentToast('guardado con éxito!');
    }).catch(error=> {
      this.presentToast('no se puede guardar');
    });
  }

  getProductos(){ //observa la coleccion todo el tiempo
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
            this.productos = res;
    });
  }
//async es funcion asincrona como el await
  async deleteProducto(producto: Producto){

    const alert = await this.alertController.create({
      cssClass:'normal',
      header:'Advertencia',
      message: '¿Estás seguro de <strong>eliminarlo</strong>?',
      buttons: [
        {
          text:'Cancelar',
          role: 'cancel',
          cssClass:'normal',
          handler: (blah) =>{
            console.log('Confirm Cancel: blah');
          }
        }, {
          text:'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, producto.id).then( res => {
                this.presentToast('eliminado con éxito!');
                this.alertController.dismiss();
              }).catch(error=> {
                this.presentToast('no se puede eliminar');
              });
          }
        }
      ]
    });
    await alert.present();
  }

  //CHECAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PARA LAS FOTOS
  nuevo(){
    this.enableNewProducto=true;
    this.newProducto= {
      nombre: '',
      precioNormal: null,
      precioReducido: null,
      foto: 'htt',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };
  }

  async presentLoading(){
    this.loading = await this.loadingController.create({
      cssClass:'normal',
      message:'guardando...',
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message:msg,
      duration:2000
    });
    toast.present();
  }

  async newImageUpload(event: any){
    if(event.target.files && event.target.files[0]){
        this.newFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
            this.newProducto.foto = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
    }

  }

}
