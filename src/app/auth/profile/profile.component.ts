import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChildService } from "../../core/services/child.service";
import { Router } from "@angular/router";
import { Child } from "../../core/interfaces/child";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  children: Child[] = [];
  loading: boolean = true;
  error: string | null = null;
  isEmpty: boolean = false;

  constructor(private childService: ChildService, private router: Router) {}

  ngOnInit() {
    // Get parentId from sessionStorage (set during login)
    const parentId = sessionStorage.getItem("parentId");
    if (parentId) {
      this.loadChildren(parseInt(parentId));
    } else {
      this.error = "Parent ID not found. Please login again.";
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
        this.error = "Failed to load children profiles";
        this.loading = false;
        console.error("Error loading children:", err);
      },
    });
  }

  continueAsParent() {
    sessionStorage.removeItem("childId")
     sessionStorage.removeItem("Child");
    this.router.navigate(["/parent/report"]);
  }

  goToChild(id: number) {
    this.childService.setRouteChildId(id);
    sessionStorage.setItem("childId", id.toString());
    this.router.navigate(["/child"]);
  }
}
