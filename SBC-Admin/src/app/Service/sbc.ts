import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SBC {
  baseurl = environment.baseUrl;
  private isExpandedSubject = new BehaviorSubject<boolean>(true);
  isExpanded$ = this.isExpandedSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  checkLoginStatus(): boolean {
    return !!sessionStorage.getItem('userid');
  }

    toggleSidebar() {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }
}
