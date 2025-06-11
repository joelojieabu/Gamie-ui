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
    {
      id: 1,
      icon: 'home',
      label: 'Dashboard',
      route: '/parent/dashboard',
      active: false,
    },
    {
      id: 2,
      icon: 'person',
      label: 'Children',
      route: '/parent/child-list',
      active: false,
    },
    {
      id: 3,
      icon: 'chat',
      label: 'Ask Amber',
      route: '/parent/chat',
      active: false,
    },
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

  changeItemBackgroundColor(id: number) {
    this.menuItems.map((item) =>
      item.id === id ? (item.active = true) : (item.active = false)
    );
  }
}
