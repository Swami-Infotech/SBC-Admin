import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team',
  imports: [FormsModule,CommonModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {
     isModalOpen = false;

  OpenModal(){
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }
}
