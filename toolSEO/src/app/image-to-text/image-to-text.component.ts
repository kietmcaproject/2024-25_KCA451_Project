import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Tesseract, { LoggerMessage } from 'tesseract.js';

// import Tesseract, { LoggerMessage } from 'tesseract.js';

@Component({
  selector: 'app-image-to-text',
  templateUrl: './image-to-text.component.html',
  styleUrls: ['./image-to-text.component.css']
})
export class ImageToTextComponent {

  constructor(private router: Router) { }
  imageText: string = '';
  loading: boolean = false;

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  handleImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] || null;

    if (!file) return;

    const reader: FileReader = new FileReader();

    reader.onload = () => {
      const imageData: string = reader.result as string;
      this.loading = true;

      Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: (message: LoggerMessage) => console.log(message)
        }
      ).then(result => {
        this.imageText = result.data.text;
        this.loading = false;
      }).catch(error => {
        console.error('OCR Error:', error);
        this.loading = false;
      });
    };

    reader.readAsDataURL(file);
  }
}
