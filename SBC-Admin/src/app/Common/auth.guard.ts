import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { InterceptorService } from './interceptor.service'; // Import InterceptorService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: InterceptorService) {} 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if a valid token exists
    if (this.authService.getToken()) {
      // const expectedRoles = route.data['roles'];
      // const UserRoles = this.authService.getUserRoles();

     
        return true; // Grant access
    }

    // Redirect to login if no token found
    this.router.navigate(['/Login']);
    return false; // Block route access
  }
}
