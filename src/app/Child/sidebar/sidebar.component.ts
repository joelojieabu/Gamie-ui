import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  menuItems = [
    {
      id: 1,
      icon: 'home',
      label: 'Dashboard',
      route: '/child',
      active: false,
    },
    {
      id: 3,
      icon: 'games',
      label: 'Games',
      route: '/child/games',
      active: false,
    },
    {
      id: 4,
      icon: 'poll',
      label: 'Leaderboard',
      route: '/child/leaderboard',
      active: false,
    },
    {
      id: 5,
      icon: 'card_giftcard',
      label: 'Rewards',
      route: '/child/rewards',
      active: false,
    },
    {
      id: 6,
      icon: 'whatshot',
      label: 'Ask Gamie',
      route: '/child/chat',
      active: false,
    },
  ];

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
    this.snackBar.open('You have been logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['my-custom-snackbar'],
    });
  }

  chatWithAI() {
    // Handle chat with AI logic here
    console.log('Chat with AI clicked');
  }

  changeItemBackgroundColor(id: number) {
    this.menuItems.map((item) =>
      item.id === id ? (item.active = true) : (item.active = false)
    );
  }
}
