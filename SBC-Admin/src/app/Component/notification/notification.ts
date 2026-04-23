import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';

@Component({
  selector: 'app-notification',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {

  isShowModal: boolean = false;
  iseditmodal: boolean = false;
  NotiForm!: FormGroup;
  user: any[] = [];
  notificationList: any[] = [];
  searchTerm: string = '';

  constructor(
    private service: SBC,
    private toast: ToastrNotificationService,
    private fb: FormBuilder
  ) {
    this.NotiForm = this.fb.group({
      adminUserID: [0],
      notificationID: [0],
      userID: [0, Validators.required],
      notificationTitle: ['', Validators.required],
      description: ['', Validators.required],
      isAll: [false]
    })
  }

  ngOnInit(): void {
    this.getAllNotifications();
    this.getalluser();
  }

  AddNoti() {
    this.iseditmodal = false;
    this.NotiForm.reset({
      adminUserID: Number(sessionStorage.getItem('userid')),
      notificationID: 0,
      userID: 0,
      isAll: true
    });
    this.isShowModal = true;
  }

  closeModal() {
    this.isShowModal = false;
    this.NotiForm.reset();
  }

  getalluser() {
    this.service.getalluser().subscribe((resp: any) => {
      if (resp.status) {
        this.user = resp.data;
      }
    });
  }

  getAllNotifications() {
    this.service.getallnotification().subscribe((resp: any) => {
      if (resp.status) {
        this.notificationList = resp.data || [];
      } else {
        this.notificationList = [];
      }
    });
  }

  editNotification(data: any) {
    this.iseditmodal = true;
    this.NotiForm.patchValue({
      adminUserID: Number(sessionStorage.getItem('userid')),
      notificationID: data.notificationID,
      userID: data.userID,
      notificationTitle: data.notificationTitle,
      description: data.description,
      isAll: data.isAll
    });
    this.isShowModal = true;
  }

  deleteNotification(id: number) {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.service.deletenotification(id).subscribe((resp: any) => {
        if (resp.status) {
          this.toast.showSuccess(resp.message);
          this.getAllNotifications();
        } else {
          this.toast.showError(resp.message);
        }
      });
    }
  }

  saveNotification() {
    if (this.NotiForm.invalid) {
      this.toast.showError("Please fill all required fields");
      return;
    }

    const payload = this.NotiForm.value;
    payload.adminUserID = Number(sessionStorage.getItem('userid'));
    payload.userID = Number(payload.userID);

    if (this.iseditmodal) {
      this.service.updatenotification(payload).subscribe((resp: any) => {
        if (resp.status) {
          this.toast.showSuccess(resp.message);
          this.closeModal();
          this.getAllNotifications();
        } else {
          this.toast.showError(resp.message);
        }
      });
    } else {
      this.service.addnotification(payload).subscribe((resp: any) => {
        if (resp.status) {
          this.toast.showSuccess(resp.message);
          this.closeModal();
          this.getAllNotifications();
        } else {
          this.toast.showError(resp.message);
        }
      });
    }
  }

  get filteredNotificationList(): any[] {
    if (!this.searchTerm) {
      return this.notificationList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.notificationList.filter(item => 
      (item.notificationTitle && item.notificationTitle.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  }

  getUserName(userID: number): string {
    const u = this.user.find(x => x.userID === userID);
    return u ? u.userName : 'Unknown';
  }
}
