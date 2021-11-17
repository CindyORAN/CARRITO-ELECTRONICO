import { CarritoService } from './../../services/carrito.service';
import { Component, Input, OnInit } from '@angular/core';
import { Producto } from './../../models';
//import { ModalController } from '@ionic/angular/providers/modal-controller';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  @Input() producto: Producto;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() {

    //console.log('El producto es ->', this.producto);
  }

  addCarrito(){
    this.carritoService.addProducto(this.producto);
  }

 /* async openModal(){
    const modal= await this.modalController.create({
      component: ComentariosComponent,
      componentProps: {producto: this.producto}
    });
    return await modal.present();
  } */

}
