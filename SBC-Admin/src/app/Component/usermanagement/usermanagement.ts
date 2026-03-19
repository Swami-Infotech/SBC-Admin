import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usermanagement',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.css',
})
export class Usermanagement {

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


  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log(file);
  }

  Redirectuser(){
    this.route.navigate(['/UserManagement/Userdetails'])
  }
}
