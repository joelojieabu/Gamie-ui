import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);

  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Clone the request and add the authorization header if token exists
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the request and catch any errors
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the error is 401 (Unauthorized), clear the token and redirect to login
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('parentId');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
