import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventmanagement',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './eventmanagement.html',
  styleUrl: './eventmanagement.css',
})
export class Eventmanagement implements OnInit {

  EventForm!: FormGroup;
  isModalOpen = false;
  isEditMode = false;
  eventList: any[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  Math = Math;

  constructor(private route: Router, private service: SBC, private toast: ToastrNotificationService, private fb: FormBuilder) {
    this.EventForm = this.fb.group({
      userID: [0],
      eventID: [0],
      eventName: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventDescription: ['', Validators.required],
      amount: [0, Validators.required],
      eventDate: ['', Validators.required],
      eventTotalKms: [0],
      eventTime: this.fb.array([]),
      eventAttachment: this.fb.array([])
    });
  }

  get eventTimeArray(): FormArray {
    return this.EventForm.get('eventTime') as FormArray;
  }

  get eventAttachmentArray(): FormArray {
    return this.EventForm.get('eventAttachment') as FormArray;
  }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userid') || '0';
    this.EventForm.patchValue({ userID: Number(userId) });
    this.getalldata();
  }

  getalldata() {
    this.service.fetcheventlist(this.pageNumber, this.pageSize).subscribe(
      (resp:any)=>{
        if(resp.status){
          this.eventList = resp.data.eventlist;
          this.totalRecords = resp.data.totalcount || 0;
          this.toast.showSuccess(resp.message);
        }else{
          this.toast.showError(resp.message);
        }
      }
    );
  }

  OpenModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.EventForm.reset({ eventID: 0, userID: sessionStorage.getItem('userid') || 0, amount: 0, eventTotalKms: 0, eventDate: new Date().toISOString().split('T')[0] });
    this.eventTimeArray.clear();
    this.eventAttachmentArray.clear();
  }

  OpenUpdateModal(event: any) {
    console.log("Patching Event Data:", event);
    this.isModalOpen = true;
    this.isEditMode = true;
    
    let formattedDate = '';
    if (event.eventDate) {
      formattedDate = event.eventDate.substring(0, 16); // YYYY-MM-DDTHH:mm
    }

    this.EventForm.patchValue({
      eventID: event.eventID,
      eventName: event.eventName,
      eventLocation: event.eventLocation,
      eventDescription: event.eventDescription,
      eventDate: formattedDate,
      amount: event.amount,
      eventTotalKms: event.eventTotalKms,
      userID: event.userID
    });

    // Patch Time Slots
    this.eventTimeArray.clear();
    if (event.eventTime && Array.isArray(event.eventTime)) {
      event.eventTime.forEach((slot: any) => {
        let timePart = '00:00';
        if (slot.startTime && slot.startTime.includes('T')) {
          timePart = slot.startTime.split('T')[1].substring(0, 5);
        } else if (slot.startTime && slot.startTime.includes(':')) {
          timePart = slot.startTime.substring(0, 5);
        }

        this.eventTimeArray.push(this.fb.group({
          timeID: [slot.timeID],
          timeTitle: [slot.timeTitle, Validators.required],
          startTime: [timePart, Validators.required]
        }));
      });
    }

    // Patch Attachments
    this.eventAttachmentArray.clear();
    if (event.eventAttachment && Array.isArray(event.eventAttachment)) {
      event.eventAttachment.forEach((att: any) => {
        if (att.attachmentURl) {
          this.eventAttachmentArray.push(this.fb.control(att.attachmentURl));
        }
      });
    }
  }

  addTimeSlot() {
    this.eventTimeArray.push(this.fb.group({
      timeID: [0],
      timeTitle: ['', Validators.required],
      startTime: ['', Validators.required]
    }));
  }

  removeTimeSlot(index: number) {
    this.eventTimeArray.removeAt(index);
  }

  addAttachment(base64: string = '') {
    this.eventAttachmentArray.push(this.fb.control(base64));
  }

  removeAttachment(index: number) {
    this.eventAttachmentArray.removeAt(index);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const rawBase64 = e.target.result.split(',')[1];
          this.addAttachment(rawBase64);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  saveEvent() {
    if (this.EventForm.invalid) {
      this.EventForm.markAllAsTouched();
      this.toast.showError("Please fill required fields");
      return;
    }

    const payload = { ...this.EventForm.getRawValue() };
    const todayStr = new Date().toISOString().split('T')[0];

    if (payload.eventDate) {
      payload.eventDate = new Date(payload.eventDate).toISOString();
    }

    payload.eventID = Number(payload.eventID || 0);
    payload.amount = Number(payload.amount || 0);
    payload.eventTotalKms = Number(payload.eventTotalKms || 0);
    payload.userID = Number(payload.userID || 0);

    // Transforming eventAttachment
    if (payload.eventAttachment && Array.isArray(payload.eventAttachment)) {
      payload.eventAttachment = payload.eventAttachment.map((img: string) => ({
        attachmentID: 0,
        attachmentURl: img || '',
        isFeatured: true
      }));
      if (payload.eventAttachment.length === 0) {
        payload.eventAttachment = [{ attachmentID: 0, attachmentURl: '', isFeatured: true }];
      }
    }

    // Transforming eventTime
    if (payload.eventTime && Array.isArray(payload.eventTime)) {
      payload.eventTime = payload.eventTime.map((item: any) => {
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

    const apiCall = this.isEditMode ? this.service.updateevent(payload) : this.service.addevent(payload);

    apiCall.subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.showSuccess(res.message || (this.isEditMode ? "Event updated" : "Event added"));
          this.closeModal();
          this.getalldata();
        } else {
          this.toast.showError(res.message || "Operation failed");
        }
      },
      error: () => this.toast.showError("Something went wrong")
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  redirect() {
    this.route.navigate(['eventmanagement/eventdetails']);
  }

  // Pagination helper methods
  get totalPages(): number { return Math.ceil(this.totalRecords / this.pageSize); }
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
  changePage(page: number) { this.pageNumber = page; this.getalldata(); }
  nextPage() { if (this.pageNumber < this.totalPages) { this.pageNumber++; this.getalldata(); } }
  previousPage() { if (this.pageNumber > 1) { this.pageNumber--; this.getalldata(); } }

  deleteevent(EventID:number){
     Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.deleteeventid(EventID).subscribe(
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
