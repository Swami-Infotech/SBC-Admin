import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from '../Service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor { 

  constructor(private loaderService: LoaderService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.getToken(); 

    if (token) { 
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }



  

    this.loaderService.showLoader();
 
    return next.handle(req).pipe(
      finalize(() => { 
        this.loaderService.hideLoader();
      }),
      catchError((error: HttpErrorResponse) => { 
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) { 
          console.log('This is a client-side error');
          errorMsg = `Error: ${error.error.message}`;
        } else { 
          console.log('This is a server-side error');
          errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
        }
        console.log(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
 
   
  getToken(): string | null {
    return sessionStorage.getItem('token'); 
  }



}
