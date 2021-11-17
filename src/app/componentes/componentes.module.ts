import { ItemcarritoComponent } from './itemcarrito/itemcarrito.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './producto/producto.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProductoComponent,
    ItemcarritoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ], exports: [
    ProductoComponent,
    ItemcarritoComponent
  ]

})
export class ComponentesModule { }
