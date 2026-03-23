import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eventdetails',
  imports: [FormsModule,CommonModule],
  templateUrl: './eventdetails.html',
  styleUrl: './eventdetails.css',
})
export class Eventdetails {

  images: string[] = [
  'assets/logo/event.avif',
  'assets/logo/event.avif',
  'assets/logo/event.avif',
  'assets/logo/event.avif'
];

selectedImage = this.images[0];

selectImage(img: string) {
  this.selectedImage = img;
}
}
