import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Method to check if the user is not on login, register, or home page
  shouldShowNavbar(): boolean {
    // Check if running in the browser
    if (typeof window !== 'undefined') {
      const path = window.location.pathname; // Use window instead of document
      return !(path === '/login' || path === '/register' || path === '/');
    }
    return false; // Default behavior when not in browser
  }
}
