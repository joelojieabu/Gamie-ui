import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChildService } from '../../core/services/child.service';

@Component({
  selector: 'app-create-child',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './create-child.component.html',
  styleUrl: './create-child.component.scss',
})
export class CreateChildComponent implements OnInit, OnDestroy {
  childForm: FormGroup;
  routeChildId!: number;
  child: any;
  addButtonDisabled: boolean = true;
  saveChangesButtonDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private childService: ChildService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.childForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.childService
      .getRouteChildId()
      .subscribe((data: number) => (this.routeChildId = data));

    if (this.routeChildId) {
      this.addButtonDisabled = true;
      this.saveChangesButtonDisabled = false;
      this.childService.findOne(this.routeChildId).subscribe((data) => {
        this.child = data;
        this.childForm.patchValue({
          firstName: this.child.firstName,
          lastName: this.child.lastName,
          userName: this.child.userName,
          dateOfBirth: this.child.dateOfBirth,
        });
      });
    } else {
      console.log('Not found');
    }
  }

  onAddChild() {
    if (this.childForm.valid) {
      const parentId = sessionStorage.getItem('parentId');
      if (!parentId) {
        this.snackBar.open(
          'Parent ID not found. Please login again.',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['my-custom-snackbar'],
          }
        );
        return;
      }

      const childDto = {
        parentId: parseInt(parentId),
        firstName: this.childForm.get('firstName')?.value,
        lastName: this.childForm.get('lastName')?.value,
        userName: this.childForm.get('userName')?.value,
        dateOfBirth: this.childForm
          .get('dateOfBirth')
          ?.value.toISOString()
          .split('T')[0],
      };

      this.childService.createChild(childDto).subscribe({
        next: (response) => {
          this.snackBar.open('Child profile added successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['my-custom-snackbar'],
          });
          // Reset form
          this.childForm.reset();
          // Navigate to dashboard after successful creation
          this.router.navigate(['/parent/report']);
        },
        error: (error) => {
          console.error('Error adding child profile:', error);
          this.snackBar.open(
            'Failed to add child profile. Please try again.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['my-custom-snackbar'],
            }
          );
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onRemoveChild() {
    // Handle remove child logic here
    this.childService.delete(this.routeChildId).subscribe(
      (response) => {
        this.snackBar.open('Child profile deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['my-custom-snackbar'],
        });
      },
      (error) => {
        this.snackBar.open(
          'Failed to delete child profile. Please try again.',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['my-custom-snackbar'],
          }
        );
      }
    );
  }

  onSaveChanges() {
    if (this.childForm.valid) {
      this.childService
        .update(this.routeChildId, this.childForm.value)
        .subscribe(
          (response) => {
            this.snackBar.open('Child profile updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['my-custom-snackbar'],
            });
          },
          (error) => {
            this.snackBar.open(
              'Failed to update child profile. Please try again.',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['my-custom-snackbar'],
              }
            );
          }
        );
    }
  }

  // Helper method to mark all fields as touched to show validation errors
  private markFormGroupTouched() {
    Object.keys(this.childForm.controls).forEach((key) => {
      const control = this.childForm.get(key);
      control?.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.childForm.reset();
    this.routeChildId = 0;
  }
}
