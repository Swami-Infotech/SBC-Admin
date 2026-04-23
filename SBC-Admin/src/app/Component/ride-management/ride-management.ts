import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ride-management',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './ride-management.html',
  styleUrl: './ride-management.css',
})
export class RideManagement implements OnInit {

  RideForm!: FormGroup;
  isModalOpen = false;
  isEditMode = false;
  showPassword = false;
  rideList: any[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  Math = Math;
  searchTerm: string = '';

  constructor(private route: Router, private service: SBC, private toast: ToastrNotificationService, private fb: FormBuilder) {
    this.RideForm = this.fb.group({
      userID: [0],
      rideID: [0],
      rideTitle: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      description: ['', Validators.required],
      rideDate: ['', Validators.required],
      rideTotalKms: [0],
      rideTime: this.fb.array([]),
      rideAttachment: this.fb.array([])
    })
  }

  get rideTimeArray(): FormArray {
    return this.RideForm.get('rideTime') as FormArray;
  }

  get rideAttachmentArray(): FormArray {
    return this.RideForm.get('rideAttachment') as FormArray;
  }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userid') || '0';
    this.RideForm.patchValue({ userID: Number(userId) });
    this.getalldata();
  }

  getalldata() {
    this.service.fetchridelist(this.pageNumber, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.rideList = res.data.rideslist;
          this.totalRecords = res.data.totalcount ;
        } else {
          this.toast.showError(res.message || "Failed to fetch rides");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong while fetching rides");
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getPages(): number[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: number[] = [];
    const current = this.pageNumber;
    
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (current >= total - 3) {
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
    return pages;
  }

  get showFirstEllipsis(): boolean {
    return this.totalPages > 7 && this.pageNumber > 4;
  }

  get showLastEllipsis(): boolean {
    return this.totalPages > 7 && this.pageNumber < this.totalPages - 3;
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.getalldata();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getalldata();
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getalldata();
    }
  }

  createTimeSlot(): FormGroup {
    return this.fb.group({
      timeID: [0],
      timeTitle: ['', Validators.required],
      startTime: ['', Validators.required]
    });
  }

  addTimeSlot() {
    this.rideTimeArray.push(this.createTimeSlot());
  }

  removeTimeSlot(index: number) {
    this.rideTimeArray.removeAt(index);
  }

  addAttachment(base64: string = '') {
    this.rideAttachmentArray.push(this.fb.control(base64));
  }

  removeAttachment(index: number) {
    this.rideAttachmentArray.removeAt(index);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        // Temporarily passing blank string as requested
        this.addAttachment('');
      }
    }
  }



  OpenModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.RideForm.reset({ rideID: 0, userID: sessionStorage.getItem('userid') || 0, rideTotalKms: 0, rideDate: new Date().toISOString().split('T')[0] });
    this.rideTimeArray.clear();
    this.rideAttachmentArray.clear();
  }

  OpenUpdateModal(ride: any) {
    console.log("Patching Ride Data:", ride);
    this.isModalOpen = true;
    this.isEditMode = true;

    let formattedDate = '';
    if (ride.rideDate) {
      formattedDate = ride.rideDate.substring(0, 16);
    }

    this.RideForm.patchValue({
      rideID: ride.rideID,
      rideTitle: ride.rideTitle,
      startLocation: ride.startLocation,
      endLocation: ride.endLocation,
      description: ride.description,
      rideDate: formattedDate,
      rideTotalKms: ride.rideTotalKms,
      userID: Number(sessionStorage.getItem('userid'))
    });

    // Patch Time Slots
    this.rideTimeArray.clear();
    if (ride.rideTime && Array.isArray(ride.rideTime)) {
      ride.rideTime.forEach((slot: any) => {
        // Extract HH:mm from ISO or full string
        let timePart = '00:00';
        if (slot.startTime && slot.startTime.includes('T')) {
          timePart = slot.startTime.split('T')[1].substring(0, 5);
        } else if (slot.startTime && slot.startTime.includes(':')) {
          timePart = slot.startTime.substring(0, 5);
        }

        this.rideTimeArray.push(this.fb.group({
          timeID: [slot.timeID],
          timeTitle: [slot.timeTitle, Validators.required],
          startTime: [timePart, Validators.required]
        }));
      });
    }

    // Patch Attachments
    this.rideAttachmentArray.clear();
    if (ride.rideAttachment && Array.isArray(ride.rideAttachment)) {
      ride.rideAttachment.forEach((att: any) => {
        if (att.attachmentURl) {
          this.addAttachment(att.attachmentURl);
        }
      });
    }
  }

  saveRide() {
    if (this.RideForm.invalid) {
      this.RideForm.markAllAsTouched();
      this.toast.showError("Please fill required fields");
      return;
    }

    const payload = { ...this.RideForm.getRawValue() };
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Ensure rideDate is in ISO format
    if (payload.rideDate) {
      payload.rideDate = new Date(payload.rideDate).toISOString();
    } else {
      payload.rideDate = today.toISOString();
    }

    // Ensure numeric fields are numbers
    payload.rideID = Number(payload.rideID || 0);
    payload.rideTotalKms = Number(payload.rideTotalKms || 0);
    payload.userID = Number(payload.userID);

    // Transforming rideAttachment to array of objects as per new schema
    if (payload.rideAttachment && Array.isArray(payload.rideAttachment)) {
      payload.rideAttachment = payload.rideAttachment.map((img: string) => {
        return {
          attachmentID: 0,
          attachmentURl: img || '',
          isFeatured: true
        };
      });

      if (payload.rideAttachment.length === 0) {
        payload.rideAttachment = [{
          attachmentID: 0, attachmentURl: '', isFeatured: true
        }];
      }
    }

    // Checking time slot format and appending today's date for full ISO
    if (payload.rideTime && Array.isArray(payload.rideTime)) {
      payload.rideTime = payload.rideTime.map((item: any) => {
        let timeStr = item.startTime || '00:00';
        if (timeStr.length === 5) timeStr += ':00';
        const fullDateTime = new Date(`${todayStr}T${timeStr}`).toISOString();

        return {
          ...item,
          timeID: Number(item.timeID || 0),
          startTime: fullDateTime
        };
      });
    }

    const apiCall = this.isEditMode
      ? this.service.updateride(payload)
      : this.service.addride(payload);

    apiCall.subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.showSuccess(res.message || (this.isEditMode ? "Ride updated" : "Ride added"));
          this.closeModal();
          this.getalldata();
          this.RideForm.reset({ rideID: 0, userID: payload.userID, rideTotalKms: 0 });
          this.rideTimeArray.clear();
          this.rideAttachmentArray.clear();
        } else {
          this.toast.showError(res.message || "Operation failed");
        }
      },
      error: (err) => {
        console.error("Ride Operation Error:", err);
        this.toast.showError("Something went wrong");
      }
    });
  }

  ViewRide(id:number) {
    this.route.navigate(['/RideManagement/UserRide',id]);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  deleteride(rideID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteride(rideID).subscribe(
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

  get filteredRideList(): any[] {
    if (!this.searchTerm) {
      return this.rideList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.rideList.filter(ride => 
      (ride.rideTitle && ride.rideTitle.toLowerCase().includes(term)) ||
      (ride.startLocation && ride.startLocation.toLowerCase().includes(term)) ||
      (ride.endLocation && ride.endLocation.toLowerCase().includes(term))
    );
  }
}
