import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  isBrowser: boolean = typeof window !== 'undefined'; // Check if running in the browser

  constructor(private router: Router, private appService: AppService) {}

  registerUser(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Both fields are required';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    // Directly call the register method
    this.createUser();
  }

  private createUser(): void {
    this.loading = true; // Indicate loading state
    this.appService.register(this.username, this.password).pipe(first()).subscribe({
      next: (response) => {
        this.loading = false;
        if (this.isBrowser) {
          localStorage.setItem('username', this.username);
        }
        this.router.navigate(['homepage']);
      },
      error: (errorResponse) => {
        this.loading = false;
        // Assuming the backend sends an error message in the response body
        if (errorResponse.error && errorResponse.error.msg) {
          this.errorMessage = errorResponse.error.msg;
        } else {
          this.errorMessage = "Registration failed. Please try again.";
        }
      }
    });
  }
}
