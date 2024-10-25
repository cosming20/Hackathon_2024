import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { MazeDisplayComponent } from './maze-display/maze-display.component';



const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'maze-display', component: MazeDisplayComponent },
  {
    path: 'homepage',
    component: HomepageComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  // Redirect from root path '/' to '/login'
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  // Handle all other routes with a wildcard route to redirect to '/login'
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
