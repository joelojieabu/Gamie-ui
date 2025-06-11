import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildService } from '../../core/services/child.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Child {
  id: number;
  parentId: number;
  firstName: string;
  lastName: string;
  userName: string;
  dateOfBirth: string;
  isActive: boolean;
  createdAt: string;
  level: number;
}

@Component({
  selector: 'app-child-list',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './child-list.component.html',
  styleUrl: './child-list.component.scss',
})
export class ChildListComponent {
  children: Child[] = [];
  loading: boolean = true;
  error: string | null = null;
  isEmpty: boolean = false;
  parentId = localStorage.getItem('parentId');

  constructor(private childService: ChildService, private router: Router) {}

  ngOnInit() {
    if (this.parentId) {
      this.loadChildren(parseInt(this.parentId));
    } else {
      this.error = 'Parent ID not found. Please login again.';
      this.loading = false;
    }
  }

  loadChildren(parentId: number) {
    this.loading = true;
    this.error = null;
    this.isEmpty = false;

    this.childService.findByParent(parentId).subscribe({
      next: (data) => {
        this.children = data;
        this.isEmpty = data.length === 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load children profiles';
        this.loading = false;
        console.error('Error loading children:', err);
      },
    });
  }

  viewReport(moduleId: string) {
    // Navigate to detailed report view
    console.log('Viewing report for module:', moduleId);
  }

  viewAll() {
    // Navigate to all reports page
    console.log('View all reports');
  }

  addChild() {
    this.router.navigateByUrl('/parent/create-child');
  }

  goToChild(id: number) {
    this.childService.setRouteChildId(id);
    this.router.navigateByUrl('/parent/create-child');
  }
}
