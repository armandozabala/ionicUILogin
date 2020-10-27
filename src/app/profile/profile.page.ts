import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  formEdit: FormGroup;
  id:any;

  constructor(private authService: AuthService, 
              private afs: FirestoreService, 
              public toastController: ToastController  ) { }

  ngOnInit() {

    this.formEdit = new FormGroup({
      email: new FormControl({value: '', disabled: true}),
      name: new FormControl( null, Validators.required),
      lastname: new FormControl( null, Validators.required),
    });  

    this.id = localStorage.getItem('id');
    
    console.log(this.id);

    this.afs.getUser(this.id).subscribe(res => {

        console.log(res);

        this.initValueForm(res);

    })


  }

  edit(form){

      console.log(form.value);

      this.afs.updateUser(this.id, form.value).then(res => {

          console.log(res);

          this.presentToast();

      }).catch(err => {

          console.log(err);
      })

  }

  initValueForm(user: any){

    this.formEdit.patchValue({
      name: user.name,
      lastname: user.lastname,
      email: user.email
    });

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

}
