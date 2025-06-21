import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { MainComponent } from './Parent/main/main.component';
import { DashboardComponent } from './Parent/dashboard/dashboard.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { CreateChildComponent } from './Parent/create-child/create-child.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './auth/login/login.component';
import { ChildListComponent } from './Parent/child-list/child-list.component';
import { MainComponent as ChildMainComponent } from './Child/main/main.component';
import { ChildDashboardComponent } from './Child/child-dashboard/child-dashboard.component';
import { RewardListComponent } from './Child/reward-list/reward-list.component';
import { GamesListComponent } from './Child/games-list/games-list.component';
import { LeaderBoardComponent } from './Child/leader-board/leader-board.component';
import { LearnComponent } from './Child/learn/learn.component';
import { BillIdentificationComponent } from './Child/bill-identification/bill-identification.component';
import { RedeemRewardComponent } from './Child/redeem-reward/redeem-reward.component';
import { FinanceQuizComponent } from './Child/finance-quiz/finance-quiz.component';

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
  {
    path: 'child',
    component: ChildMainComponent,
    children: [
      { path: '', component: ChildDashboardComponent },
      { path: 'rewards', component: RewardListComponent },
      { path: 'games', component: GamesListComponent },
      { path: 'leaderboard', component: LeaderBoardComponent },
      { path: 'learn', component: LearnComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'bill-identification', component: BillIdentificationComponent },
      { path: 'redeem-reward', component: RedeemRewardComponent },
      { path: 'money-basics', component: FinanceQuizComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
