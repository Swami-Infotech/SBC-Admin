import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SBC } from './Service/sbc';
import { LoaderService } from './Service/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from "./Component/sidebar/sidebar";
import { LoaderComponent } from './Component/loader/loader';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    FormsModule,
    CommonModule, Sidebar, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

   protected readonly title = signal('VarahVerse-Admin');
  isLoginPage = signal(false);
  private router = inject(Router);
  public loader = inject(LoaderService);

  constructor() {
    // Initial check
    this.isLoginPage.set(this.router.url === '/Login' || window.location.pathname === '/Login');
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage.set(event.url === '/Login' || event.urlAfterRedirects === '/Login');
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
