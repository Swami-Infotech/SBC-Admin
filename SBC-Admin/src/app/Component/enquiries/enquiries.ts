import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enquiries',
  imports: [FormsModule,CommonModule],
  templateUrl: './enquiries.html',
  styleUrl: './enquiries.css',
})
export class Enquiries {
   isModalOpen = false;

   OpenModal(){
    this.isModalOpen = true;
   }

   closeModal(){
    this.isModalOpen = false;
   }
}
