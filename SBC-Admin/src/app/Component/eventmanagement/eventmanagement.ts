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
  searchTerm: string = '';

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
      isFree: [false],
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
      (resp: any) => {
        if (resp.status) {
          this.eventList = resp.data.eventlist || resp.data.Eventlist || resp.data || [];
          this.totalRecords = resp.data.totalcount || 0;
          this.toast.showSuccess(resp.message);
        } else {
          this.toast.showError(resp.message);
        }
      }
    );
  }

  OpenModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.EventForm.reset({
      eventID: 0,
      userID: Number(sessionStorage.getItem('userid') || 0),
      amount: 0,
      eventTotalKms: 0,
      isFree: false,
      eventDate: new Date().toISOString().split('T')[0]
    });
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

    const eventId = Number(event.eventID || event.EventID || 0);

    this.EventForm.patchValue({
      eventID: eventId,
      eventName: event.eventName,
      eventLocation: event.eventLocation,
      eventDescription: event.eventDescription,
      eventDate: formattedDate,
      amount: event.amount,
      eventTotalKms: event.eventTotalKms,
      userID: Number(sessionStorage.getItem('userid') || event.userID || 0),
      isFree: event.isFree || false
    });

    this.eventTimeArray.clear();
    this.eventAttachmentArray.clear();

    // Patch initial time slots if present on event object
    if (event.eventTime && Array.isArray(event.eventTime) && event.eventTime.length > 0) {
      this.populateTimeSlots(event.eventTime);
    } else if (eventId > 0) {
      // Fetch time slots from API
      this.service.getalleventtimebyid(eventId).subscribe({
        next: (res: any) => {
          if (res.status && Array.isArray(res.data)) {
            this.populateTimeSlots(res.data);
          }
        }
      });
    }

    // Patch initial attachments if present on event object
    if (event.eventAttachment && Array.isArray(event.eventAttachment) && event.eventAttachment.length > 0) {
      this.populateAttachments(event.eventAttachment);
    } else if (eventId > 0) {
      // Fetch attachments from API
      this.service.getalleventimagebyid(eventId).subscribe({
        next: (res: any) => {
          if (res.status && Array.isArray(res.data)) {
            this.populateAttachments(res.data);
          }
        }
      });
    }
  }

  private populateTimeSlots(slots: any[]) {
    this.eventTimeArray.clear();
    slots.forEach((slot: any) => {
      let timePart = '00:00';
      if (slot.startTime && slot.startTime.includes('T')) {
        timePart = slot.startTime.split('T')[1].substring(0, 5);
      } else if (slot.startTime && slot.startTime.includes(':')) {
        timePart = slot.startTime.substring(0, 5);
      }

      this.eventTimeArray.push(this.fb.group({
        timeID: [Number(slot.timeID || slot.TimeID || 0)],
        timeTitle: [slot.timeTitle || slot.TimeTitle, Validators.required],
        startTime: [timePart, Validators.required]
      }));
    });
  }

  private populateAttachments(attachments: any[]) {
    this.eventAttachmentArray.clear();
    attachments.forEach((att: any) => {
      const url = att?.attachmentURl || att?.attachmentURL || att?.attachmentUrl || (typeof att === 'string' ? att : '');
      const id = Number(att?.attachmentID || att?.attachmentId || 0);
      if (url) {
        this.addAttachment(url, id);
      }
    });
  }

  createAttachmentGroup(url: string = '', attachmentID: number = 0): FormGroup {
    return this.fb.group({
      attachmentID: [attachmentID],
      attachmentURl: [url, Validators.required],
      isFeatured: [true]
    });
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

  addAttachment(url: string = '', attachmentID: number = 0) {
    this.eventAttachmentArray.push(this.createAttachmentGroup(url, attachmentID));
  }

  removeAttachment(index: number) {
    this.eventAttachmentArray.removeAt(index);
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

  saveEvent() {
    if (this.EventForm.invalid) {
      this.EventForm.markAllAsTouched();
      this.toast.showError("Please fill required fields");
      return;
    }

    const payload = { ...this.EventForm.getRawValue() };
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (payload.eventDate) {
      if (typeof payload.eventDate === 'string' && payload.eventDate.includes('T')) {
        const [dPart, tPart] = payload.eventDate.split('T');
        const [yr, mo, da] = dPart.split('-').map((v: string) => parseInt(v, 10));
        const tPieces = tPart.split(':');
        const hr = parseInt(tPieces[0], 10) || 0;
        const mn = parseInt(tPieces[1], 10) || 0;
        payload.eventDate = new Date(Date.UTC(yr, mo - 1, da, hr, mn, 0)).toISOString();
      } else {
        const d = new Date(payload.eventDate);
        payload.eventDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0)).toISOString();
      }
    } else {
      payload.eventDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0)).toISOString();
    }

    payload.eventID = Number(payload.eventID || 0);
    payload.amount = Number(payload.amount || 0);
    payload.eventTotalKms = Number(payload.eventTotalKms || 0);
    payload.userID = Number(payload.userID || sessionStorage.getItem('userid') || 0);
    payload.isFree = !!payload.isFree;

    // Transforming eventAttachment to pure base64 for upload, or existing URL
    if (payload.eventAttachment && Array.isArray(payload.eventAttachment)) {
      payload.eventAttachment = payload.eventAttachment.map((item: any) => {
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
    } else {
      payload.eventAttachment = [];
    }

    // Transforming eventTime without timezone shift
    if (payload.eventTime && Array.isArray(payload.eventTime)) {
      payload.eventTime = payload.eventTime.map((item: any) => {
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
        if (payload.eventDate && typeof payload.eventDate === 'string' && payload.eventDate.includes('-')) {
          datePart = payload.eventDate.split('T')[0];
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

  viewEvent(eventID: number) {
    this.route.navigate(['eventmanagement/eventdetails', eventID]);
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

  get filteredEventList(): any[] {
    if (!this.searchTerm) {
      return this.eventList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.eventList.filter(event => 
      (event.eventName && event.eventName.toLowerCase().includes(term)) ||
      (event.eventLocation && event.eventLocation.toLowerCase().includes(term))
    );
  }
}
