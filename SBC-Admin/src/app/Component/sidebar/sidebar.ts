import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
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
    Dashboard: 'bi bi-speedometer2',
    UserManagement: 'bi bi-people-fill',
    RideManagement: 'bi bi-bicycle',
    EventManagement: 'bi bi-calendar-event-fill',
    Gallery: 'bi bi-images',
    AboutUs: 'bi bi-info-circle-fill',
    Slider: 'bi bi-collection-play-fill',
    Team: 'bi bi-person-badge-fill',
    Inquiry: 'bi bi-chat-left-dots-fill',
    RideSafety: 'bi bi-shield-check',
    Notification: 'bi bi-bell-fill',
  };

  getIcon(componentName: string): string {
    return this.componentIcons[componentName] || 'bi bi-question-circle';
  }
  onLogout() {
    localStorage.removeItem('token');
    sessionStorage.clear();

    this.router.navigate(['/Login']);

    console.log('User logged out successfully');
  }
}
