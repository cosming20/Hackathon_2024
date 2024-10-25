import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { MazeDisplayComponent } from './maze-display/maze-display.component';
import { HistoryComponent } from './history/history.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] }, // Protected route
  { path: 'maze-display', component: MazeDisplayComponent, canActivate: [AuthGuard] }, // Protected route
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] }, // Protected route
  // Redirect from root path '/' to '/login'
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  // Handle all other routes with a wildcard route to redirect to '/login'
  { path: '**', redirectTo: '/homepage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }