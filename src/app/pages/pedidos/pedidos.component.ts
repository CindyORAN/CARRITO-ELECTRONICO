import { Pedido } from './../../models';
import { FirebaseauthService } from './../../services/firebaseauth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})

export class PedidosComponent implements OnInit, OnDestroy {

  nuevoSuscriber: Subscription;
  culminadoSuscriber: Subscription;
  pedidos: Pedido[] = [];
  pedidosEntregados: Pedido[] = [];

  nuevos= true;

  constructor(public menuControler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }
  ngOnDestroy(){
    if (this.nuevoSuscriber){
        this.nuevoSuscriber.unsubscribe();
    }
    if(this.culminadoSuscriber){
      this.culminadoSuscriber.unsubscribe();
    }
  }

  openMenu(){
    console.log('open menu');
    this.menuControler.toggle('principal');
    }

  changeSegment(ev: any){
    //console.log('ChangeSegment()', ev.detail.value);
    const opc = ev.detail.value;
    if (opc === 'culminados') {
      this.nuevos=false;
      this.getPedidosCulminados();
    }
    if (opc === 'nuevos'){
      this.nuevos=true;
      this.getPedidosNuevos();
    }
  }
  async getPedidosNuevos(){
    console.log('getPedidosNuevos()');
    const path ='pedidos';
    // eslint-disable-next-line prefer-const
    let startAt = null;
    if (this.pedidos.length){
      startAt = this.pedidos[this.pedidos.length -1 ].fecha;
    }
    this.nuevoSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'enviado', startAt).subscribe(res=> {
      if(res.length){
        console.log('getPedidosNuevos()--> res', res);
        res.forEach(pedido => {
          this.pedidos.push(pedido);
        });
      }
    });
  }

  async getPedidosCulminados(){
    console.log('getPedidosCulminados()');
    const path ='pedidos';
    // eslint-disable-next-line prefer-const
    let startAt = null;
    if (this.pedidosEntregados.length){
      startAt = this.pedidosEntregados[this.pedidosEntregados.length -1 ].fecha;
    }
    this.nuevoSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'entregado', startAt).subscribe(res=> {
      if(res.length){
        console.log('getPedidosCulminados()--> res', res);
        res.forEach(pedido => {
          this.pedidosEntregados.push(pedido);
        });
      }
    });
  }

  cargarMas(){
    if (this.nuevos){
      this.getPedidosNuevos();
    } else {
      this.getPedidosCulminados();
    }

  }

}
