import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enquiries',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './enquiries.html',
  styleUrl: './enquiries.css',
})
export class Enquiries implements OnInit {
  isModalOpen = false;
  isEditMode = false;
  submitted = false;
  enquiryForm!: FormGroup;
  enquiryList: any[] = [];
  
  // Pagination
  pageNumber: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private service: SBC,
    private toast: ToastrNotificationService
  ) {
    this.enquiryForm = this.fb.group({
      enquiryID: [0],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      userCity: ['', Validators.required],
      bikeName: ['', Validators.required],
      bikeModel: ['', Validators.required],
      bikeNumber: ['', Validators.required],
      experience: [0, [Validators.required, Validators.min(0)]],
      occupation: ['', Validators.required],
      dob: ['', Validators.required],
      helmet: [false],
      jacket: [false],
      gloves: [false],
      partOfGroup: [false],
      joinDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getalldata();
  }

  getalldata() {
    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.service.getallenquiry(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.enquiryList = res.data.records || [];
          this.totalRecords = res.data.totalRecords || 0;
        } else {
          this.toast.showError(res.message || "Failed to fetch inquiries");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong");
      }
    });
  }

  // Pagination Methods
  changePage(page: number) {
    this.pageNumber = page;
    this.getalldata();
  }

  previousPage() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.getalldata();
    }
  }

  nextPage() {
    if ((this.pageNumber + 1) * this.pageSize < this.totalRecords) {
      this.pageNumber++;
      this.getalldata();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getPages(): number[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }
    const pages: number[] = [];
    const current = this.pageNumber;
    
    if (current <= 3) {
      for (let i = 0; i <= 4; i++) pages.push(i);
    } else if (current >= total - 4) {
      for (let i = total - 5; i < total; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
    return pages;
  }

  get showFirstEllipsis(): boolean {
    return this.totalPages > 7 && this.pageNumber > 3;
  }

  get showLastEllipsis(): boolean {
    return this.totalPages > 7 && this.pageNumber < this.totalPages - 4;
  }

  OpenModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.submitted = false;
    this.enquiryForm.reset({
      enquiryID: 0,
      experience: 0,
      helmet: false,
      jacket: false,
      gloves: false,
      partOfGroup: false
    });
  }

  openEditModal(enquiry: any) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.submitted = false;
    
    let formattedDob = '';
    if (enquiry.dob) {
      formattedDob = enquiry.dob.split('T')[0];
    }

    this.enquiryForm.patchValue({
      ...enquiry,
      dob: formattedDob
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.enquiryForm.reset();
  }

  saveEnquiry() {
    this.submitted = true;
    if (this.enquiryForm.invalid) {
      this.toast.showError("Please fill all required fields correctly");
      return;
    }

    const payload = { ...this.enquiryForm.value };
    payload.experience = Number(payload.experience);
    payload.enquiryID = Number(payload.enquiryID);

    const apiCall = this.isEditMode 
      ? this.service.updateenquiry(payload) 
      : this.service.addenquiry(payload);

    apiCall.subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.showSuccess(res.message || (this.isEditMode ? "Inquiry updated" : "Inquiry added"));
          this.closeModal();
          this.getalldata();
        } else {
          this.toast.showError(res.message || "Operation failed");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong");
      }
    });
  }

  deleteEnquiry(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteenquiry(id).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.toast.showSuccess(res.message);
              this.getalldata();
            } else {
              this.toast.showError(res.message);
            }
          },
          error: () => this.toast.showError("Delete failed")
        });
      }
    });
  }
}
