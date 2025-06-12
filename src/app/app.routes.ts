import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { MainComponent } from './Parent/main/main.component';
import { DashboardComponent } from './Parent/dashboard/dashboard.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { CreateChildComponent } from './Parent/create-child/create-child.component';
import { ChatComponent } from './Parent/chat/chat.component';
import { LoginComponent } from './auth/login/login.component';
import { ChildListComponent } from './Parent/child-list/child-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'parent-login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profiles', component: ProfileComponent },
  {
    path: 'parent',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'report', component: DashboardComponent },
      { path: 'create-child', component: CreateChildComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'child-list', component: ChildListComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
