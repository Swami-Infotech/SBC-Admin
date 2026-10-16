import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';

@Component({
  selector: 'app-eventdetails',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './eventdetails.html',
  styleUrl: './eventdetails.css',
})
export class Eventdetails implements OnInit {
  eventID: number = 0;
  eventDetails: any = null;
  eventTimes: any[] = [];
  images: string[] = [];
  selectedImage: string = 'assets/logo/event.avif';
  loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: SBC,
    private toast: ToastrNotificationService
  ) {}

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventID = Number(idParam || history.state?.eventID || 0);

    if (this.eventID > 0) {
      this.loadEventData();
    } else {
      this.images = ['assets/logo/event.avif'];
      this.selectedImage = this.images[0];
    }
  }

  loadEventData() {
    this.loading = true;
    const userId = Number(sessionStorage.getItem('userid') || 0);

    // 1. Fetch Event Details
    this.service.geteventbyid(this.eventID, userId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status && res.data) {
          this.eventDetails = res.data;
          this.eventTimes = res.data.eventTime || [];
        } else {
          this.toast.showError(res.message || "Event not found");
        }
      },
      error: () => {
        this.loading = false;
        this.toast.showError("Failed to load event details");
      }
    });

    // 2. Fetch Images
    this.service.getalleventimagebyid(this.eventID).subscribe({
      next: (res: any) => {
        if (res.status && Array.isArray(res.data) && res.data.length > 0) {
          this.images = res.data
            .map((att: any) => this.getImageUrl(att?.attachmentURl || att?.attachmentURL || att?.url || ''))
            .filter((url: string) => !!url);

          if (this.images.length > 0) {
            this.selectedImage = this.images[0];
          } else {
            this.images = ['assets/logo/event.avif'];
            this.selectedImage = this.images[0];
          }
        } else {
          this.images = ['assets/logo/event.avif'];
          this.selectedImage = this.images[0];
        }
      },
      error: () => {
        this.images = ['assets/logo/event.avif'];
        this.selectedImage = this.images[0];
      }
    });
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return 'data:image/png;base64,' + url;
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  goBack() {
    this.router.navigate(['eventmanagement']);
  }
}
