import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  isToBack = false;

  IMAGE_PATH: any;

  constructor(private camera: Camera,  private cameraPreview: CameraPreview) { }

  public async captureCamera() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    return this.camera.getPicture(options); 

  }


  public async captureGalery() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }
    return this.camera.getPicture(options); 

  }

  takePicture() {
   return this.cameraPreview.takePicture({
      width: 1280,
      height: 1280,
      quality: 85
    });
  }

  startCameraAbove() {
    this.cameraPreview.stopCamera().then(() => {
      this.isToBack = false;
      this.cameraPreview.startCamera({ x: 80, y: 450, width: 250, height: 300, toBack: false, previewDrag: true, tapPhoto: true });
    })
  }

  stopCamera() {
    this.cameraPreview.stopCamera();
  }



}
