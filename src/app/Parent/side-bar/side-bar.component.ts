import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  constructor(private router: Router) {}

  menuItems = [
    { icon: 'home', label: 'Dashboard', route: '/dashboard' },
    {
      icon: 'trending_up',
      label: 'Child Progress',
      route: '/child-progress',
      active: true,
    },
    { icon: 'card_giftcard', label: 'Rewards', route: '/rewards' },
    { icon: 'person', label: 'Manage Children', route: '/manage-children' },
    { icon: 'notifications', label: 'Notifications', route: '/notifications' },
    { icon: 'settings', label: 'Account Settings', route: '/account-settings' },
  ];

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    // Handle logout logic here
    console.log('Logout clicked');
  }

  chatWithAI() {
    // Handle chat with AI logic here
    console.log('Chat with AI clicked');
  }
}
