import { FirestoreService } from 'src/app/services/firestore.service';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private path = 'Productos/';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  productos: Producto[] = [];

  constructor(public menuControler: MenuController,
              public firestoreService: FirestoreService) {

                this.loadProductos();
              }

  ngOnInit() {}

  openMenu(){
    console.log('open menu');
    this.menuControler.toggle('principal');
  }

  loadProductos(){
    this.firestoreService.getCollection<Producto>(this.path,).subscribe( res => {
      console.log(res);
      this.productos = res;
    });
  }

}
