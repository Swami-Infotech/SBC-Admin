import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gallery',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  isModalOpen = false;
  isEditOpen = false;
  showPassword = false;
  GallaryForm!: FormGroup;
  selectedFileName: string | null = null;
  selectedImageFile: File | null = null;
  gallery: any;
  searchTerm: string = '';

  constructor(private route: Router,
    private service: SBC,
    private toast: ToastrNotificationService,
    private fb: FormBuilder
  ) {
    this.GallaryForm = this.fb.group({
      userID: [0],
      galleryID: [0],
      galleryImage: ['', Validators.required],
      isFeatured: [false]
    })
  }

  ngOnInit(): void {
    this.getalldata();
  }

  OpenModal() {
    this.isModalOpen = true;
  }

  Updategallery(d: any) {
    this.isEditOpen = true;
    this.GallaryForm.patchValue({
      userID: d.createdBy,
      galleryID: d.galleryID,
      galleryImage: d.galleryImage,
      isFeatured: d.isFeatured
    });
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false;
    this.GallaryForm.patchValue({
      userID: 0,
      galleryID: 0,
      galleryImage: '',
      isFeatured: ''
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  AddGallery() {
    let imagePayload = this.GallaryForm.value.galleryImage;
    if (imagePayload && imagePayload.includes('base64,')) {
      imagePayload = imagePayload.split('base64,')[1];
    }
    const payload = {
      userID: Number(sessionStorage.getItem('userid')),
      galleryID: this.GallaryForm.value.galleryID,
      galleryImage: imagePayload,
      isFeatured: this.GallaryForm.value.isFeatured
    }
    if (this.isEditOpen) {
      this.service.updategallery(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.ngOnInit();
            this.closeModal();
          }
        }
      )
    } else {
      this.service.addgallery(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.ngOnInit();
            this.closeModal();
          }
        }
      )
    }

  }


  fileChangeEvents(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList[0]) {
      const file = fileList[0];

      if (!file.type.startsWith('image/')) {
        this.toast.showError("Please select a valid image file");
        element.value = '';
        return;
      }

      this.selectedFileName = file.name;
      this.selectedImageFile = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.GallaryForm.patchValue({ galleryImage: e.target.result });
      };
    }
  }

  getalldata() {
    this.service.getallgallery().subscribe(
      (resp: any) => {
        if (resp.status) {
          this.gallery = resp.data;
        } else {
          this.toast.showError(resp.message);
        }
      }
    )
  }

  Deletegallery(galleryID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deletegallery(galleryID).subscribe(
          (resp: any) => {
            this.toast.showSuccess(resp.message);
            this.getalldata();
          },
          (err: any) => {
            console.log(err);
            this.toast.showError('Delete failed');
          }
        );
      }
    });
  }

  get filteredGallery(): any[] {
    if (!this.searchTerm) {
      return this.gallery;
    }
    const term = this.searchTerm.toLowerCase();
    return this.gallery.filter((item: any) => 
      (item.galleryID && item.galleryID.toString().includes(term)) ||
      (item.isFeatured ? 'featured'.includes(term) : 'not featured'.includes(term))
    );
  }
}
