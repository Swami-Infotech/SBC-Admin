import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  imports: [FormsModule,CommonModule],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css',
})
export class Aboutus {
   isModalOpen = false;
  showPassword = false;

  constructor(private route:Router){}

Addabout(){
  this.route.navigate(['/AboutUs/AddAbout'])
}


  closeModal() {
    this.isModalOpen = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  redirect(){

  }
}
