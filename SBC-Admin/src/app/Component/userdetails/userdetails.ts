import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userdetails',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './userdetails.html',
  styleUrl: './userdetails.css',
})
export class Userdetails implements OnInit {
  userID: number = 0;
  userData: any = null;
  rideList: any[] = [];
  stats: any = {
    totalKm: 0,
    totalRides: 0,
    totalEvents: 0,
    membershipExpiry: ''
  };

  constructor(
    private route: ActivatedRoute,
    private service: SBC,
    private toast: ToastrNotificationService
  ) {}

  ngOnInit(): void {
    this.userID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userID) {
      this.getUserDetails();
    }
  }

  getUserDetails() {
    this.service.fetchuserdetails(this.userID).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.userData = res.data;
          this.rideList = res.data.rideList || [];
          this.stats = {
            totalKm: res.data.totalKmsRideDone || 0,
            totalRides: res.data.totalRidesDone || 0,
            totalEvents: res.data.totalEventsDone || 0,
            membershipExpiry: res.data.membershipExpiry
          };
        } else {
          this.toast.showError(res.message || "Failed to fetch user details");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong while fetching user details");
      }
    });
  }
}
