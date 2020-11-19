import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  form: FormGroup;
  loading:any;

  constructor( private authService: AuthService, 
               private afs: FirestoreService,
               private router: Router,
               private loadingController: LoadingController,
               private toastController: ToastController,
               private menuCtrl: MenuController   ) { }

  ngOnInit() {
    
    this.menuCtrl.enable(false);

    this.form = new FormGroup({
      email: new FormControl( null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      password: new FormControl( null, Validators.required),
      firstname: new FormControl( null, Validators.required),
      lastname: new FormControl( null, Validators.required),
    });  
  }

  register(form){

    this.presentLoading('Saving....');

    this.authService.createUser(form.value.email, form.value.password).then((data)=>{

        let us:any = {
            firstname: form.value.firstname,
            lastname: form.value.lastname,
            email: form.value.email,
            uid: data.user.uid
        }

        this.afs.createUserUID(us).then(data => {

            console.log(data);

            this.router.navigate(['/login']);

            this.presentToast();

            this.loading.dismiss();


        }).catch(err => {

          console.log("inside"+err);
   
       })

    }).catch(err => {

       console.log(err);

    })

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your have been saved.',
      duration: 2000
    });
    toast.present();
  }


  async presentLoading(msj:any) {
    this.loading = await this.loadingController.create({
      message: msj,
      translucent: true,
    });
    this.loading.present();
}


}
