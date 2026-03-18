import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
 isExpanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isExpanded: boolean = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(private router: Router) {
    this.isExpanded$.subscribe((expanded) => {
      this.isExpanded = expanded;
    });
  }

  ngOnInit(): void {}

  toggleSidebar() {
    if (!this.isExpanded) {
      this.isExpanded$.next(true);
      this.sidebarToggled.emit(true);
    }
  }

  getIsExpanded(): Observable<boolean> {
    return this.isExpanded$.asObservable();
  }

  componentIcons: { [key: string]: string } = {
    Dashboard: 'bi bi-grid',
    Home: 'bi bi-house-door',
    Category: 'bi bi-tags',
    Order: 'bi bi-receipt',
    Product: 'bi bi-box-seam',
    Customer: 'bi bi-person',
    Slider: 'bi bi-sliders',
    Artist: 'bi bi-person-bounding-box',
    Coupon: 'bi bi-ticket-perforated',
    Staff: 'bi bi-people',
    State: 'bi bi-geo-alt',
    Tax: 'bi bi-receipt',
    Preferences: 'bi bi-gear',
    Testimonial: 'bi bi-wechat',
    Content: 'bi bi-body-text',
    AboutUs: 'bi bi-file-earmark-person',
    Blog: 'bi bi-substack',
    Faq: 'bi bi-patch-question',
    ContactUs: 'bi bi-chat',
    Review: 'bi bi-star-fill',
  };

  getIcon(componentName: string): string {
    return this.componentIcons[componentName] || 'bi bi-question-circle';
  }
  onLogout() {
    localStorage.removeItem('token');
    sessionStorage.clear();

    this.router.navigate(['/login']);

    console.log('User logged out successfully');
  }
}
