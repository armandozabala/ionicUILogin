import { PhotoService } from './../services/photo.service';
import { StorageService } from './../services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { ScrollDetail } from '@ionic/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  formEdit: FormGroup;
  id:any;
  IMAGE_PATH: any;
  showToolbar = false;


  constructor(private authService: AuthService, 
              private afs: FirestoreService, 
              private photo: PhotoService,
              private actionSheetController: ActionSheetController,
              private storage: StorageService,
              public toastController: ToastController  ) { }

  ngOnInit() {

    this.formEdit = new FormGroup({
      email: new FormControl({value: '', disabled: true}),
      name: new FormControl( null, Validators.required),
      lastname: new FormControl( null, Validators.required),
    });  

    this.id = localStorage.getItem('id');
    
    console.log(this.id);

    this.afs.getUser(this.id).subscribe( (res:any) => {

        console.log(res);

        this.initValueForm(res);

        this.formEdit.value.img =  res.img != null ?  res.img :  this.IMAGE_PATH='../../../assets/imgs/logocirculo.png';

        this.IMAGE_PATH = this.formEdit.value.img;

    })


  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 225;
    }
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



  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camara',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.captureImage();
        }
      },
      {
        text: 'Library',
        role: 'destructive',
        icon: 'image',
        handler: () => {
          this.selectMedia();
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


   selectMedia() {

    this.photo.captureGalery().then( (imageData) => {
     
      

      setTimeout( async () => {

        this.IMAGE_PATH = 'data:image/jpeg;base64,' + imageData;

        const fileData = this.storage.dataURLToBlob( this.IMAGE_PATH);

        this.formEdit.value.img =  await this.storage.startUpload(fileData, 'photos');

      },500)
     
    }, (err) => {
      console.log(err);
       this.IMAGE_PATH = '../../../assets/imgs/logocirculo.png';
    });
  
  }

  captureImage(){
    this.photo.captureCamera().then((imageData) => {
     
       setTimeout( async () => {

        this.IMAGE_PATH = 'data:image/jpeg;base64,' + imageData;

        const fileData = this.storage.dataURLToBlob( this.IMAGE_PATH);

        this.formEdit.value.img = await this.storage.startUpload(fileData, 'photos');
        
      },500)
     
    }, (err) => {
      console.log(err);
       this.IMAGE_PATH = '../../../assets/imgs/logocirculo.png';
    });
  }

}
