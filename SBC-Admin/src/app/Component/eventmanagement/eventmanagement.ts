import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventmanagement',
  imports: [FormsModule,CommonModule],
  templateUrl: './eventmanagement.html',
  styleUrl: './eventmanagement.css',
})
export class Eventmanagement {

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
  redirect(){
    this.route.navigate(['eventmanagement/eventdetails'])
  }
}
