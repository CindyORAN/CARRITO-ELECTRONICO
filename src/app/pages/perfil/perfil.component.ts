import { FirebaseauthService } from './../../services/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Cliente } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  cliente: Cliente = {
    uid: '',
    email: '',
    nombre: '',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null,
  };

  newFile: any;
  uid= '';
  suscriberUserInfo: Subscription;
  ingresarEnable = false;

  constructor(public menuControler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService,) {

                this.firebaseauthService.stateAuth().subscribe(res => {
                  console.log(res);
                  if (res != null){
                    this.uid = res.uid;
                    this.getUserInfo(this.uid);
                  } else {
                    this.initCliente();
                  }
                });
              }

  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    console.log(uid);
  }

  //metodo para inicializar el cliente
  initCliente(){
    this.uid = '';
      this.cliente = {
        uid: '',
        email: '',
        nombre: '',
        celular: '',
        foto: '',
        referencia: '',
        ubicacion: null,
      };
      console.log(this.cliente);
  }


  openMenu(){
    console.log('open menu');
    this.menuControler.toggle('principal');
  }

  async newImageUpload(event: any){
    if(event.target.files && event.target.files[0]){
        this.newFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
            this.cliente.foto = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
    }

  }

  async registrarse(){
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular,
    };
    const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch(err => {
      console.log('error-->', err);
    });
    const uid = await this.firebaseauthService.getUid();
    this.cliente.uid = uid;
    this.guardarUser();
    console.log(uid);
  }

  async guardarUser(){ //luego le damos una respuesta con res

    const path = 'Clientes';
    const name = this.cliente.nombre;
    if (this.newFile !== undefined) {
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.cliente.foto = res;
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then( res=>{
        console.log('Guardado con éxito');

    }).catch(error=> {

    });
  }

  async salir(){
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
  };

  getUserInfo(uid: string){
    console.log('getUserInfo');
    const path = 'Clientes';
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res => {
          this.cliente = res;
    });
  }

  ingresar(){
    const credentiales = {
      email: this.cliente.email,
      password: this.cliente.celular,
    };
    this.firebaseauthService.login(credentiales.email, credentiales.password).then ( res => {
      console.log('ingreso con éxito');
    });
  }

}
