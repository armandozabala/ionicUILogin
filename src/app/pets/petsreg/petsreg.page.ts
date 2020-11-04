import { ActionSheetController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-petsreg',
  templateUrl: './petsreg.page.html',
  styleUrls: ['./petsreg.page.scss'],
})
export class PetsregPage implements OnInit {

  formPets: FormGroup;
  IMAGE_PATH ='../../../assets/imgs/logocirculo.png';
  showToolbar = false;
  
  constructor(private actionSheetController: ActionSheetController) { }

  ngOnInit() {

    this.formPets = new FormGroup({
      email: new FormControl({value: '', disabled: true}),
      name: new FormControl( null, Validators.required),
      lastname: new FormControl( null, Validators.required),
    });  

  }

  editPets(form){

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camara',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
         // this.captureImage();
        }
      },
      {
        text: 'Library',
        role: 'destructive',
        icon: 'image',
        handler: () => {
         // this.selectMedia();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
