import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SBC } from '../../../Service/sbc';
import { ToastrNotificationService } from '../../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-ride',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-ride.html',
  styleUrl: './user-ride.css',
})
export class UserRide implements OnInit {
  rideID: number = 0;
  selectedTab: number = 0; // 0: Member, 1: Outsider
  joinersList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: SBC,
    private toast: ToastrNotificationService
  ) { }

  ngOnInit(): void {
    this.rideID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.rideID) {
      this.fetchJoiners();
    }
  }

  setTab(tab: number) {
    this.selectedTab = tab;
    this.fetchJoiners();
  }

  fetchJoiners() {
    this.joinersList = [];
    if (this.selectedTab === 0) {
      // Members
      this.service.fetchjoinedmembers(this.rideID, 0).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.joinersList = res.data || [];
          } else {
            this.toast.showError(res.message || "Failed to fetch members");
          }
        },
        error: (err) => {
          this.toast.showError("Something went wrong");
        }
      });
    } else {
      // Outsiders
      this.service.fetchoutsiderjoiners(this.rideID, 1).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.joinersList = res.data || [];
          } else {
            this.toast.showError(res.message || "Failed to fetch outsiders");
          }
        },
        error: (err) => {
          this.toast.showError("Something went wrong");
        }
      });
    }
  }

  deleteJoiner(userID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteusers(userID).subscribe(
          (resp: any) => {
            this.toast.showSuccess(resp.message);
            this.fetchJoiners();
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
