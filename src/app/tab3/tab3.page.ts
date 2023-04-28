import { Component, ElementRef, ViewChild } from '@angular/core';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  containerWidth: number = 800;
  containerHeight: number = 600;
  capturedImage: string | null = null;
  cameraActive!: boolean;
  image!: string | null;

  @ViewChild('canvas', { static: false }) canvas!: ElementRef;

  constructor() { }

  ngOnInit() {
    this.openCamera();
  }

  ionViewWillLeave() {
    this.stopCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async openCamera() {
    if (this.cameraActive) {
      return;
    }

    const cameraPreviewOpts: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      width: 600,
      height: 400
    };

    await CameraPreview.start(cameraPreviewOpts);
    this.cameraActive = true;
  }

  async stopCamera() {
    await CameraPreview.stop();
    this.cameraActive = false;
  }

  async captureImage() {
    const capturePreviewPicture: CameraPreviewPictureOptions = {
      quality: 90
    }

    const result = await CameraPreview.capture(capturePreviewPicture);
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    const imageObj = new Image();

    imageObj.onload = async () => {
      context.drawImage(imageObj, 200, 200, 400, 400, 0, 0, canvas.width, canvas.height);
      this.image = canvas.toDataURL('image/jpeg', 0.9);
    };

    imageObj.src = `data:image/jpeg;base64,${result.value}`;
    this.stopCamera();
  }

  flipCamera() {
    CameraPreview.flip()
  }

}
