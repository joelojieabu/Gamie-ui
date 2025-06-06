import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { ChildLoginComponent } from './auth/child-login/child-login.component';
import { ParentLoginComponent } from './auth/parent-login/parent-login.component';
import { MainComponent } from './Parent/main/main.component';
import { DashboardComponent } from './Parent/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'parent-login', pathMatch: 'full' },
  { path: 'child-login', component: ChildLoginComponent },
  { path: 'parent-login', component: ParentLoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'parent',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
