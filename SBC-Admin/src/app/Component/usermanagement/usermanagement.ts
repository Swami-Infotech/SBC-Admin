import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usermanagement',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.css',
})
export class Usermanagement {

  isModalOpen = false;
  showPassword = false;

  OpenModal() {
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log(file);
  }
}
