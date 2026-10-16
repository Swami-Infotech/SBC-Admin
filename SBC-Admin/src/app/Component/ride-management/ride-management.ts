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
      isFree: [false],
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

  createAttachmentGroup(url: string = '', attachmentID: number = 0): FormGroup {
    return this.fb.group({
      attachmentID: [attachmentID],
      attachmentURl: [url, Validators.required],
      isFeatured: [true]
    });
  }

  addAttachment(url: string = '', attachmentID: number = 0) {
    this.rideAttachmentArray.push(this.createAttachmentGroup(url, attachmentID));
  }

  removeAttachment(index: number) {
    this.rideAttachmentArray.removeAt(index);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          this.toast.showError('Please select a valid image file');
          continue;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Data = e.target.result as string;
          this.addAttachment(base64Data, 0);
        };
        reader.readAsDataURL(file);
      }
      event.target.value = '';
    }
  }

  getImageUrl(item: any): string {
    const value = typeof item === 'string' ? item : (item?.attachmentURl || '');
    if (!value) return '';
    if (value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    return 'data:image/png;base64,' + value;
  }

  OpenModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.RideForm.reset({ rideID: 0, userID: sessionStorage.getItem('userid') || 0, rideTotalKms: 0, rideDate: new Date().toISOString().split('T')[0], isFree: false });
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
      userID: Number(sessionStorage.getItem('userid')),
      isFree: ride.isFree || false
    });

    // Patch Time Slots
    this.rideTimeArray.clear();
    if (ride.rideTime && Array.isArray(ride.rideTime) && ride.rideTime.length > 0) {
      this.populateRideTimeSlots(ride.rideTime);
    } else if (ride.rideID) {
      this.service.getallridetimebyid(ride.rideID).subscribe({
        next: (res: any) => {
          if (res.status && Array.isArray(res.data)) {
            this.populateRideTimeSlots(res.data);
          }
        }
      });
    }

    // Patch Attachments
    this.rideAttachmentArray.clear();
    if (ride.rideAttachment && Array.isArray(ride.rideAttachment) && ride.rideAttachment.length > 0) {
      this.populateRideAttachments(ride.rideAttachment);
    } else if (ride.rideID) {
      this.service.getallrideimagebyid(ride.rideID).subscribe({
        next: (res: any) => {
          if (res.status && Array.isArray(res.data)) {
            this.populateRideAttachments(res.data);
          }
        }
      });
    }
  }

  private populateRideTimeSlots(slots: any[]) {
    this.rideTimeArray.clear();
    slots.forEach((slot: any) => {
      let timePart = '00:00';
      if (slot.startTime && slot.startTime.includes('T')) {
        timePart = slot.startTime.split('T')[1].substring(0, 5);
      } else if (slot.startTime && slot.startTime.includes(':')) {
        timePart = slot.startTime.substring(0, 5);
      }

      this.rideTimeArray.push(this.fb.group({
        timeID: [Number(slot.timeID || slot.TimeID || 0)],
        timeTitle: [slot.timeTitle || slot.TimeTitle, Validators.required],
        startTime: [timePart, Validators.required]
      }));
    });
  }

  private populateRideAttachments(attachments: any[]) {
    this.rideAttachmentArray.clear();
    attachments.forEach((att: any) => {
      const url = att?.attachmentURl || att?.attachmentURL || att?.attachmentUrl || att?.url || (typeof att === 'string' ? att : '');
      const id = Number(att?.attachmentID || att?.attachmentId || 0);
      if (url) {
        this.addAttachment(url, id);
      }
    });
  }

  saveRide() {
    if (this.RideForm.invalid) {
      this.RideForm.markAllAsTouched();
      this.toast.showError("Please fill required fields");
      return;
    }

    const payload = { ...this.RideForm.getRawValue() };
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Ensure rideDate is formatted without timezone shift
    if (payload.rideDate) {
      if (typeof payload.rideDate === 'string' && payload.rideDate.includes('T')) {
        const [dPart, tPart] = payload.rideDate.split('T');
        const [yr, mo, da] = dPart.split('-').map((v: string) => parseInt(v, 10));
        const tPieces = tPart.split(':');
        const hr = parseInt(tPieces[0], 10) || 0;
        const mn = parseInt(tPieces[1], 10) || 0;
        payload.rideDate = new Date(Date.UTC(yr, mo - 1, da, hr, mn, 0)).toISOString();
      } else {
        const d = new Date(payload.rideDate);
        payload.rideDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0)).toISOString();
      }
    } else {
      payload.rideDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0)).toISOString();
    }

    // Ensure numeric fields are numbers
    payload.rideID = Number(payload.rideID || 0);
    payload.rideTotalKms = Number(payload.rideTotalKms || 0);
    payload.userID = Number(payload.userID);

    // Transforming rideAttachment to array of objects as per schema
    if (payload.rideAttachment && Array.isArray(payload.rideAttachment)) {
      payload.rideAttachment = payload.rideAttachment.map((item: any) => {
        let url = typeof item === 'string' ? item : (item?.attachmentURl || '');
        const id = typeof item === 'object' && item?.attachmentID ? Number(item.attachmentID) : 0;

        if (url && url.includes('base64,')) {
          url = url.split('base64,')[1];
        }

        return {
          attachmentID: id,
          attachmentURl: url || '',
          isFeatured: true
        };
      }).filter((att: any) => att.attachmentURl && att.attachmentURl.trim().length > 0);

      if (payload.rideAttachment.length === 0) {
        payload.rideAttachment = [{
          attachmentID: 0,
          attachmentURl: '',
          isFeatured: true
        }];
      }
    }

    // Checking time slot format and preserving local hours/minutes without timezone shift
    if (payload.rideTime && Array.isArray(payload.rideTime)) {
      payload.rideTime = payload.rideTime.map((item: any) => {
        let timeStr = item.startTime || '00:00';
        if (timeStr.includes('T')) {
          timeStr = timeStr.split('T')[1];
        }
        if (timeStr.includes('.')) {
          timeStr = timeStr.split('.')[0];
        }
        if (timeStr.includes('Z')) {
          timeStr = timeStr.replace('Z', '');
        }

        const tPieces = timeStr.split(':');
        const hr = parseInt(tPieces[0], 10) || 0;
        const mn = parseInt(tPieces[1], 10) || 0;

        let datePart = todayStr;
        if (payload.rideDate && typeof payload.rideDate === 'string' && payload.rideDate.includes('-')) {
          datePart = payload.rideDate.split('T')[0];
        }

        const [yr, mo, da] = datePart.split('-').map((v: string) => parseInt(v, 10));
        const fullDateTime = new Date(Date.UTC(yr, mo - 1, da, hr, mn, 0)).toISOString();

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
          this.RideForm.reset({ rideID: 0, userID: payload.userID, rideTotalKms: 0, isFree: false });
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
