import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading:any;
  
  formLogin: FormGroup;
  
  constructor(private formBuilder: FormBuilder,  
    private  router:  Router, 
    private loadingController: LoadingController,
    private authService: AuthService, 
    private alertController: AlertController,
    private afs: FirestoreService, 
    private menuCtrl: MenuController ) { }

  ngOnInit() {

    this.menuCtrl.enable(false);

    this.formLogin = new FormGroup({
      email: new FormControl( null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      password: new FormControl( null, Validators.required),
    });  

  }


  login(form){



    
    if(form.value.email == null && form.value.password == null)
    {
      
      this.presentAlert("Empty fields...");
      return;
      
    }

    this.presentLoading();

 

    this.authService.signUser(form.value.email, form.value.password).then((data:any)=>{


      console.log(data.user.uid);

      localStorage.setItem('id',data.user.uid);

      this.router.navigate(['/home']);

      this.menuCtrl.enable(true);

      this.loading.dismiss();
  
     /* this.afs.getUserUID(data.user.uid).subscribe((resp) => {


        console.log(resp);
          

      });*/

    }).catch(err =>{
        console.log(err);
        this.loading.dismiss();
        this.presentAlert(err);
    });
    
  }




  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    this.loading.present();
}


async presentAlert(message) {
  const alert = await this.alertController.create({
    subHeader: 'AVISO',
    message: message,
    buttons: ['Aceptar']
  });

  await alert.present();
}

}
