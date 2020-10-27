import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  form: FormGroup;

  constructor( private authService: AuthService, 
               private afs: FirestoreService,
               private menuCtrl: MenuController   ) { }

  ngOnInit() {
    
    this.menuCtrl.enable(false);

    this.form = new FormGroup({
      email: new FormControl( null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      password: new FormControl( null, Validators.required),
      name: new FormControl( null, Validators.required),
      lastname: new FormControl( null, Validators.required),
    });  
  }

  register(form){

    this.authService.createUser(form.value.email, form.value.password).then((data)=>{

        let us:any = {
            name: form.value.name,
            lastname: form.value.lastname,
            email: form.value.email,
            uid: data.user.uid
        }

        this.afs.createUserUID(us).then(data => {

            console.log(data);

        }).catch(err => {

          console.log("inside"+err);
   
       })

    }).catch(err => {

       console.log(err);

    })

  }

}
