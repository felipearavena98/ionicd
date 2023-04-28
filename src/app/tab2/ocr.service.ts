import { Injectable } from '@angular/core';
import * as Tesseract from 'tesseract.js';

@Injectable({
    providedIn: 'root',
})
export class OcrService {
    constructor() { }

    async getTextFromImage(imageBlob: Blob): Promise<string> {
        try {
            const imageURL = URL.createObjectURL(imageBlob);
            const result = await Tesseract.recognize(imageURL, 'eng', {
                logger: (m) => console.log(m),
            });
            URL.revokeObjectURL(imageURL);
            return result.data.text;
        } catch (error) {
            console.error('Error al reconocer el texto: ', error);
            throw error;
        }
    }
}