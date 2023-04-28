import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import Cropper from 'cropperjs';

@Component({
    selector: 'app-crop-image-modal',
    templateUrl: './crop-image-modal.html',
    styleUrls: ['./crop-image-modal.scss'],
})
export class CropImageModalComponent implements OnInit {
    @ViewChild('image', { static: false }) imageElement: ElementRef | undefined;
    imageBase64: string;
    cropper: Cropper | undefined;

    constructor(private modalController: ModalController, private navParams: NavParams) {
        this.imageBase64 = this.navParams.get('imageBase64');
    }

    ngOnInit() { }

    ionViewDidEnter() {
        this.cropper = new Cropper(this.imageElement!.nativeElement, {
            aspectRatio: 16 / 9, // Establece el aspecto del rectángulo de recorte aquí
            movable: true,
            cropBoxResizable: true,
        });
    }

    async cropAndClose() {
        const croppedCanvas = this.cropper!.getCroppedCanvas();
        const croppedImageBase64 = croppedCanvas.toDataURL('image/jpeg', 0.8);
        await this.modalController.dismiss(croppedImageBase64);
    }

    async cancel() {
        await this.modalController.dismiss();
    }
}