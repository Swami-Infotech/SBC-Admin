import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-management',
  imports: [FormsModule,CommonModule],
  templateUrl: './ride-management.html',
  styleUrl: './ride-management.css',
})
export class RideManagement {


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
}
