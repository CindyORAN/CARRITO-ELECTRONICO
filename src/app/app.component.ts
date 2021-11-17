import { FirebaseauthService } from './services/firebaseauth.service';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
//import { SplashScreen} from '@ionic-native/splashscreen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  admin = false;

  constructor(
    private platform: Platform,
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar,
    private firebaseauthService: FirebaseauthService) {
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault(); //ESTO ES MAS PARA APP MOVILES
      //this.splashScreen.hide();  //ESTO ES MAS PARA APP MOVILES
      this.getUid();
    });
  }

  getUid(){
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res !== null){
        if(res.uid === 'a4dMtkRtZRRAtniYC01XB0u1LwE2'){ //insertamos el uid del administrador
          //EL ADMINISTRADOR ES --> admin@gmail.com, 123456
          this.admin = true;;
        } else{
          this.admin = false;
        }
      } else {
        this.admin = false;
      }
     });
  }

}
