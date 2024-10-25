import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading = false;
  isBrowser: boolean;

  constructor(
    private router: Router,
    private appService: AppService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const username = localStorage.getItem('username');
      if (username) this.username = username;
    }
  }

  signIn() {
    this.loading = true;
    this.appService
      .login(this.username, this.password)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (this.isBrowser) {
            localStorage.setItem('username', this.username);
          }
          this.router.navigate(['homepage']);
        },
        error: () => {
          this.loading = false;
          alert("Invalid username or password");
        }
      });
  }
}
