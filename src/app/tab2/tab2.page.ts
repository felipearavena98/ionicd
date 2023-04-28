import { Component, ElementRef, ViewChild } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import * as Tesseract from 'tesseract.js';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('cropperContainer') cropperContainer!: ElementRef<HTMLDivElement>; // inicializar cropperContainer
  @ViewChild('cropperImage') cropperImage!: ElementRef<HTMLImageElement>; // inicializar cropperImage
  resultText = '';
  constructor() { }

  async scanID() {
    // Tomar una foto con la cámara
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
    });

    // Establezca las coordenadas y el tamaño del área que desea escanear
    const x = 50;
    const y = 50;
    const width = 300;
    const height = 200;

    // Cargar Tesseract y configurar el idioma y el área de reconocimiento
    const worker = Tesseract.createWorker({
      logger: (m) => console.log(m),
    });
    await (await worker).load();
    await (await worker).loadLanguage('spa');
    await (await worker).initialize('spa');
    await (await worker).setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      user_defined_dpi: '300',
    });

    // Crear un elemento de imagen y asignarle la URL de la imagen capturada
    const img = new Image();
    if (image.webPath) {
      img.src = image.webPath;
    } else {
      console.error('Error: No se pudo obtener la ruta de la imagen.');
      return;
    }

    // Recortar la imagen utilizando CropperJS cuando la imagen esté cargada
    img.onload = async () => {
      this.cropperContainer.nativeElement.appendChild(img);
      const cropper = new Cropper(img, {
        viewMode: 0,
        dragMode: 'none',
        autoCropArea: 1,
        aspectRatio: width / height,
        cropBoxMovable: false,
        cropBoxResizable: false,
        async crop(event) {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx!.drawImage(img, event.detail.x - x, event.detail.y - y, event.detail.width, event.detail.height, 0, 0, width, height);

          // Realizar el reconocimiento OCR
          const result = await (await worker).recognize(canvas.toDataURL());

          // Procesar el resultado
          console.log(result.data.text);

          // Finalizar el worker de Tesseract
          (await
            // Finalizar el worker de Tesseract
            worker).terminate();
        }
      });
    };
  }
}