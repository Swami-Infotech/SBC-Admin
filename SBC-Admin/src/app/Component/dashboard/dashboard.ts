import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboardData: any = null;
  upcomingEvents: any[] = [];
  upcomingRides: any[] = [];

  constructor(
    private service: SBC,
    private toast: ToastrNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userid');
    if (userId) {
      this.getDashboardData(Number(userId));
    }
  }

  getDashboardData(userId: number) {
    this.service.getadmindashboard(userId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.dashboardData = res.data;
          this.upcomingEvents = res.data.eventslist || [];
          this.upcomingRides = res.data.rideslist || [];
        } else {
          this.toast.showError(res.message || "Failed to fetch dashboard data");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong while fetching dashboard data");
      }
    });
  }

  viewRide(id: number) {
    this.router.navigate(['/RideManagement/UserRide', id]);
  }

  viewEvent() {
    this.router.navigate(['/eventmanagement']);
  }
}
