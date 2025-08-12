import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-img-to-pdf',
  templateUrl: './img-to-pdf.component.html',
  styleUrls: ['./img-to-pdf.component.css']
})
export class ImgToPdfComponent  {

  constructor(private router: Router) { }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
  
  imageUrl: string | ArrayBuffer | null = null;


 onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

convertToPDF(): void {
  if (this.imageUrl) {
    const doc = new jsPDF();
    const img = this.imageUrl as string;
    doc.addImage(img, 'JPEG', 10, 10, 180, 160);
    doc.save('image-to-pdf.pdf');
  }
}

}
