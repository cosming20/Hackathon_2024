import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {
  username: string | null = null; 

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }

  logout(): void {
    this.appService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response); // Handle success response if needed
        localStorage.removeItem('username'); // Clear the username from localStorage
        this.router.navigate(['/login']); // Redirect to the login page
      },
      error: (error) => {
        console.error('Logout failed:', error); // Handle error response if needed
      }
    });
  }
}
