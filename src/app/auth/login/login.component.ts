import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../core/services/auth.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-login",
  imports: [FormsModule, MatProgressSpinnerModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  username: string = '';
  password: string = "";
  isLoading: boolean = false;
  hidePassword: boolean = true;

  // Image URLs - Replace these with your actual image URLs
  leftBackgroundImage: string = "assets/login.svg";
  topRightImage: string = "assets/gtlogo.svg";
  mainLogoImage: string = "assets/loginface.svg";

  onLogin() {
    this.isLoading = true;
    if (this.username && this.password) {
      const credentials = {
        username: this.username,
        password: this.password,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          // Store the token or user data if needed
          sessionStorage.setItem("parentId", response.user.id);
          sessionStorage.setItem("token", response.access_token);
          sessionStorage.setItem("parent", JSON.stringify(response) || ""); // Adjust based on your API response structure

          this.snackBar.open("You have logged in successfully", "Close", {
            duration: 3500,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ["my-custom-snackbar"],
          });
          this.isLoading = false;
          this.router.navigate(["/profiles"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Login failed:", error);
          this.snackBar.open(
            "Login failed. Please check your credentials.",
            "Close",
            {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top",
              panelClass: ["my-custom-snackbar"],
            }
          );
        },
      });
    } else {
      this.snackBar.open("Please enter both username and password", "Close", {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ["my-custom-snackbar"],
      });
    }
  }

  goToRegister() {
    this.router.navigateByUrl("/register");
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
