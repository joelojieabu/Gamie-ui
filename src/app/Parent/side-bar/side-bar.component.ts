import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  menuItems = [
    {
      id: 1,
      icon: 'school',
      label: 'Growth Corner',
      route: '/parent/report',
      active: false,
    },
    {
      id: 2,
      icon: 'supervisor_account',
      label: 'My Kids',
      route: '/parent/child-list',
      active: false,
    },
    {
      id: 3,
      icon: 'whatshot',
      label: 'Ask Gamie ',
      route: '/parent/chat',
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
