import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-about',
  imports: [FormsModule, CommonModule, NgxEditorModule],
  templateUrl: './add-about.html',
  styleUrl: './add-about.css',
})
export class AddAbout implements OnInit, OnDestroy {


  aboutID: number = 0;
  key: string = '';
  value: string = '';
  aboutusType: number = 0;
  dataPlace: number = 0;
  isEditModal: boolean = false;
  submitted: boolean = false;

  previewImage: string | ArrayBuffer | null = null;
  fileName: string = '';
  editor!: Editor;
  
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  aboutusTypes = [
    { id: 0, name: 'Text' },
    { id: 1, name: 'Image' },
    { id: 2, name: 'Video' }
  ];

  dataPlaces = [
    { id: 0, name: 'HomePage' },
    { id: 1, name: 'AboutusPage' },
    { id: 2, name: 'Other' }
  ];

  constructor(
    private service: SBC,
    private toast: ToastrNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    const stateData = history.state.data;
    if (stateData) {
      this.isEditModal = true;
      this.aboutID = Number(stateData.aboutID);
      this.key = stateData.key;
      this.aboutusType = Number(stateData.aboutusType);
      this.dataPlace = Number(stateData.dataPlace);
      
      const isImageUrl = stateData.value && (stateData.value.startsWith('http') || stateData.value.startsWith('data:image') || stateData.value.length > 500);

      if (this.aboutusType === 1 || isImageUrl) {
        // If it's explicitly Image type OR it looks like a URL/Base64
        this.previewImage = stateData.value.startsWith('http') || stateData.value.startsWith('data:image') 
          ? stateData.value 
          : 'data:image/png;base64,' + stateData.value;
        this.value = '';
        this.aboutusType = 1; // Force to Image type (ID 1)
      } else if (this.aboutusType === 0) {
        this.value = stateData.value;
        this.previewImage = null;
      } else {
        this.value = stateData.value;
        this.previewImage = null;
      }
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  redirect(){
    this.router.navigate(['/AboutUs'])
  }


  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        // If image is selected, we might want to store it in 'value' if dataPlace is Image
        // and send it. User said "key value wise".
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    this.submitted = true;
    if (!this.key || this.aboutusType === 0) {
      this.toast.showError("Please fill required fields");
      return;
    }

    let finalValue = this.value;
    
    // If an image is present and value is empty, maybe send the image?
    // Or users can choose dataPlace 'Image' and we send previewImage.
    if (this.previewImage && !this.value) {
       finalValue = this.previewImage.toString();
       if (finalValue.includes('base64,')) {
         finalValue = finalValue.split('base64,')[1];
       }
    }

    const payload = {
      userID: Number(sessionStorage.getItem('userid')),
      aboutID: this.aboutID,
      key: this.key,
      value: finalValue,
      aboutusType: Number(this.aboutusType),
      dataPlace: Number(this.dataPlace)
    };

    if (this.isEditModal) {
      this.service.updateabout(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.router.navigate(['/AboutUs']);
          } else {
            this.toast.showError(resp.message);
          }
        },
        (err) => {
          this.toast.showError("Update failed");
        }
      );
    } else {
      this.service.addabout(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.router.navigate(['/AboutUs']);
          } else {
            this.toast.showError(resp.message);
          }
        },
        (err) => {
          this.toast.showError("Something went wrong");
        }
      );
    }
  }
}
