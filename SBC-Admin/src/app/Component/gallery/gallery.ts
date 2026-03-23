import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  imports: [FormsModule,CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
   isModalOpen = false;
  showPassword = false;

  constructor(private route:Router){}

  OpenModal() {
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
