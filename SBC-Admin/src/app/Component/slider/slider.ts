import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-slider',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider implements OnInit {

  SliderForm!: FormGroup;
  selectedFileName: string | null = null;
  selectedImageFile: File | null = null;
  slider: any;
  isModalOpen = false;
  showPassword = false;
  isEditModal = false;

  ngOnInit(): void {
    this.getalldata();
  }

  constructor(private service: SBC,
    private toast: ToastrNotificationService,
    private fb: FormBuilder
  ) {
    this.SliderForm = this.fb.group({
      userID: [0],
      sliderID: [0],
      sliderTitle: ['', Validators.required],
      sliderImage: ['', Validators.required],
      redirectTo: [''],
      isActive: [false]
    })
  }




  OpenModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.SliderForm.patchValue({
      userID: 0,
      sliderID: 0,
      sliderTitle: '',
      sliderImage: '',
      redirectTo: '',
      isActive: ''
    });
  }

  updateslider(d: any) {
    this.isEditModal = true;
    this.SliderForm.patchValue({
      userID: d.createdBy,
      sliderID: d.sliderID,
      sliderTitle: d.sliderTitle,
      sliderImage: d.sliderImage,
      redirectTo: d.redirectTo,
      isActive: d.isActive
    });
    this.isModalOpen = true;
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
        this.SliderForm.patchValue({ sliderImage: e.target.result });
      };
    }
  }

  AddSlider() {

    let imagePayload = this.SliderForm.value.sliderImage;
    if (imagePayload && imagePayload.includes('base64,')) {
      imagePayload = imagePayload.split('base64,')[1];
    }

    const payload = {
      userID: Number(sessionStorage.getItem('userid')),
      sliderID: this.SliderForm.value.sliderID,
      sliderImage: imagePayload,
      redirectTo: this.SliderForm.value.redirectTo,
      sliderTitle:this.SliderForm.value.sliderTitle
    }
    if (this.isEditModal) {
      this.service.updateslider(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.closeModal();
            this.getalldata();
          } else {
            this.toast.showError(resp.message);
          }
        }
      )
    } else {
      this.service.addslider(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.closeModal();
            this.getalldata();
          } else {
            this.toast.showError(resp.message);
          }
        }
      )
    }

  }

  getalldata() {
    this.service.getallslider().subscribe(
      (resp: any) => {
        if (resp.status) {
          this.slider = resp.data
        }
      }
    )
  }

  deleteslider(sliderID:number){
    Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.deleteslider(sliderID).subscribe(
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
}
