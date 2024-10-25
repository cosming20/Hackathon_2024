import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private appService: AppService, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.appService.isAuthenticated().pipe(
        first(),
        catchError(() => {
          this.router.navigate(['/login']);
          return [false];
        })
      ).subscribe({
        next: (response) => {
          if (response.authenticated) {
            resolve(true);
          } else {
            this.router.navigate(['/login']);
            resolve(false);
          }
        },
        error: () => {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}