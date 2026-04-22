import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ridesefty',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './ridesefty.html',
  styleUrl: './ridesefty.css',
})
export class Ridesefty implements OnInit {

  isopenmodal: boolean = false;
  iseditmodal: boolean = false;
  rideForm!: FormGroup;
  ride: any;

  ngOnInit(): void {
    this.getalldata();
  }


  constructor(private service: SBC,
    private fb: FormBuilder, private toast: ToastrNotificationService
  ) {
    this.rideForm = this.fb.group({
      userID: [0],
      rideSafetyID: [0],
      safetyText: ['', Validators.required]
    })
  }


  OpenModal() {
    this.isopenmodal = true;
  }

  closeModal() {
    this.isopenmodal = false;
    this.rideForm.reset();
  }

  updateride(d: any) {
    this.iseditmodal = true;
    this.rideForm.patchValue({
      userID: d.createdBy,
      rideSafetyID: d.rideSafetyID,
      safetyText: d.safetyText
    });
    this.isopenmodal = true;
  }


  AddRide() {
    const payload = {
      userID: Number(sessionStorage.getItem('userid')),
      rideSafetyID: this.rideForm.value.rideSafetyID,
      safetyText: this.rideForm.value.safetyText
    }
    if (this.iseditmodal) {
      this.service.updateridesefty(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.getalldata();
            this.closeModal();
          } else {
            this.toast.showError(resp.message);
            this.closeModal();
          }
        }
      )
    } else {
      this.service.addridesefty(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.getalldata();
            this.closeModal();
          } else {
            this.toast.showError(resp.message);
            this.closeModal();
          }
        }
      )
    }

  }

  getalldata() {
    this.service.getridesefty().subscribe(
      (resp: any) => {
        if (resp.status) {
          this.ride = resp.data;
          this.toast.showSuccess(resp.message)
        } else {
          this.toast.showError(resp.message)
        }
      }
    )
  }

  deleteride(rideSafetyID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteridesefty(rideSafetyID).subscribe(
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
