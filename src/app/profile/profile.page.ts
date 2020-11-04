import { PhotoService } from './../services/photo.service';
import { StorageService } from './../services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import { ScrollDetail } from '@ionic/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  formEdit: FormGroup;
  id:any;
  showToolbar = false;

  loading:any;

  IMAGE_PATH ='../../../assets/imgs/logocirculo.png';

  constructor(private authService: AuthService, 
              private afs: FirestoreService, 
              private photo: PhotoService,
              private loadingController: LoadingController,
              private actionSheetController: ActionSheetController,
              private storage: StorageService,
              public toastController: ToastController  ) { 

               

              }

  ngOnInit() {

    

    this.presentLoading('Cargando información...');

    this.formEdit = new FormGroup({
      email: new FormControl({value: '', disabled: true}),
      name: new FormControl( null, Validators.required),
      lastname: new FormControl( null, Validators.required),
    });  

    this.id = localStorage.getItem('id');
    
    console.log(this.id);

    this.afs.getUser(this.id).subscribe( (res:any) => {

        this.initValueForm(res);

        this.formEdit.value.img =  res.img != null ?  res.img :  this.IMAGE_PATH='../../../assets/imgs/logocirculo.png';

        this.IMAGE_PATH = this.formEdit.value.img;

        this.loading.dismiss();

    })


  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 225;
    }
  }

  edit(form){

    this.presentLoading('Saving....');

      this.afs.updateUser(this.id, form.value).then(res => {

          this.loading.dismiss();

          this.presentToast("User have been saved...");

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

  async presentToast(msg?:any) {
    const toast = await this.toastController.create({
      message: msg,
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

    
    this.presentLoading('Loading image....');


    this.photo.captureGalery().then( (imageData) => {
     
      

      setTimeout( async () => {

        this.IMAGE_PATH = 'data:image/jpeg;base64,' + imageData;

        const fileData = this.storage.dataURLToBlob( this.IMAGE_PATH);

        this.formEdit.value.img =  await this.storage.startUpload(fileData, 'photos');

        this.presentToast('Photo have been loaded');

        this.loading.dismiss();

      },100)
     
    }, (err) => {
      console.log(err);
       this.IMAGE_PATH = '../../../assets/imgs/logocirculo.png';
    });
  
  }

  captureImage(){

    this.presentLoading('Loading image....');

    this.photo.captureCamera().then((imageData) => {
     
       setTimeout( async () => {

        this.IMAGE_PATH = 'data:image/jpeg;base64,' + imageData;

        const fileData = this.storage.dataURLToBlob( this.IMAGE_PATH);

        this.formEdit.value.img = await this.storage.startUpload(fileData, 'photos');

        this.loading.dismiss();
        
      },500)
     
    }, (err) => {
      console.log(err);
       this.IMAGE_PATH = '../../../assets/imgs/logocirculo.png';
    });
  }


  async presentLoading(msj:any) {
    this.loading = await this.loadingController.create({
      message: msj,
      translucent: true,
    });
    this.loading.present();
}


}
