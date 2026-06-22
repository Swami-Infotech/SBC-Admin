import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userride',
  imports: [FormsModule, CommonModule],
  templateUrl: './userride.html',
  styleUrl: './userride.css',
})
export class Userride implements OnInit {
  userRides: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 100;
  totalRecords: number = 0;
  searchTerm: string = '';
  Math = Math;

  // Image Modal
  isImageModalOpen: boolean = false;
  previewImage: string = '';

  get filteredUserRides(): any[] {
    if (!this.searchTerm) {
      return this.userRides;
    }
    const search = this.searchTerm.toLowerCase().trim();
    return this.userRides.filter(r => 
      (r.rideTitle && r.rideTitle.toLowerCase().includes(search)) ||
      (r.userName && r.userName.toLowerCase().includes(search)) ||
      (r.rideDescription && r.rideDescription.toLowerCase().includes(search))
    );
  }

  constructor(
    private service: SBC,
    private toast: ToastrNotificationService
  ) {}

  ngOnInit(): void {
    this.getalldata();
  }

  getalldata() {
    const payload = {
      pageNumber: this.pageNumber - 1, // API expects 0-based page number
      pageSize: this.pageSize
    };

    this.service.getalluserRides(payload).subscribe({
      next: (res: any) => {
        console.log('GetAllUserRides Response:', res);
        if (res.status) {
          if (res.data) {
            // Support multiple possible response structures
            this.userRides = res.data.userRides || 
                             res.data.userRide || 
                             res.data.data || 
                             res.data.userRidesList || 
                             (Array.isArray(res.data) ? res.data : []);
                             
            this.totalRecords = res.data.totalcount || 
                                res.data.totalCount || 
                                this.userRides.length || 
                                0;
          } else {
            this.userRides = [];
            this.totalRecords = 0;
          }
        } else {
          this.toast.showError(res.message || "Failed to fetch user rides");
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.showError("Something went wrong while fetching user rides");
      }
    });
  }

  changeStatus(ride: any, newStatus: any) {
    const adminUserId = sessionStorage.getItem('userid') || '0';
    const payload = {
      userRideID: ride.userRideID,
      reviewStatus: Number(newStatus),
      adminUserID: Number(adminUserId)
    };

    this.service.changeuserRideStatus(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          ride.reviewStatus = Number(newStatus);
          this.toast.showSuccess(res.message || "Status updated successfully");
        } else {
          this.toast.showError(res.message || "Failed to update status");
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.showError("Something went wrong while updating status");
      }
    });
  }

  deleteRide(ride: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this user ride!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteuserRide(ride.userRideID).subscribe({
          next: (resp: any) => {
            if (resp.status) {
              this.toast.showSuccess(resp.message || "User ride deleted successfully");
              this.getalldata();
            } else {
              this.toast.showError(resp.message || "Failed to delete user ride");
            }
          },
          error: (err: any) => {
            console.error(err);
            this.toast.showError('Delete failed');
          }
        });
      }
    });
  }

  onSearch() {
    this.pageNumber = 1;
    this.getalldata();
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.getalldata();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getalldata();
    }
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalRecords) {
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

  openImageModal(imgUrl: string) {
    this.previewImage = imgUrl;
    this.isImageModalOpen = true;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.previewImage = '';
  }
}
