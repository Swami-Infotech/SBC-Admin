import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-add-about',
  imports: [FormsModule, CommonModule, NgxEditorModule],
  templateUrl: './add-about.html',
  styleUrl: './add-about.css',
})
export class AddAbout implements OnInit {


  title: string = '';
  description: string = '';
  previewImage: string | ArrayBuffer | null = null;
  fileName: string = '';
  editor!: Editor;
  html: string = '';


  ngOnInit(): void {
    this.editor = new Editor();
  }


  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    const payload = {
      title: this.title,
      description: this.description,
      image: this.previewImage
    };

    console.log('Saved Data:', payload);
  }
}
