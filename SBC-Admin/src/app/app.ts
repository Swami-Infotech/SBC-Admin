import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SBC } from './Service/sbc';
import { LoaderService } from './Service/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from './Component/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    FormsModule,
    CommonModule,
    Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  isSidebarExpanded = true;
  isLoggedIn = false;
  isLoading!: boolean;
  isHomePage = false;

  constructor(
    private service: SBC,
    private loaderService: LoaderService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        this.isLoggedIn = !url.startsWith('/login');
      }
    });
  }

  ngOnInit(): void {
    this.service.isExpanded$.subscribe((expanded) => {
      this.isSidebarExpanded = expanded;

      this.loaderService.isLoading.subscribe((loading: boolean) => {
        this.isLoading = loading;
      });
    });

    this.service.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    var loading = sessionStorage.getItem('firstLoginDone');
    if (loading == 'false') {
      window.location.reload();
    }
  }

  onSidebarToggle() {
    this.service.toggleSidebar();
    if (!this.isHomePage) {
      this.isSidebarExpanded = this.isSidebarExpanded;
    }
  }
}
