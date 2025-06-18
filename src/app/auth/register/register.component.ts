import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-register",
  imports: [ReactiveFormsModule, CommonModule, MatInputModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  registerForm!: FormGroup;
  currentStep: number = 1;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  // Image URLs - Replace these with your actual image URLs
  leftBackgroundImage: string = "assets/login.svg";
  topRightImage: string = "assets/gtlogo.svg";
  mainLogoImage: string = "assets/loginface.svg";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(2)]],
        lastName: ["", [Validators.required, Validators.minLength(2)]],
        username: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        phoneNumber: [
          "",
          [Validators.required, Validators.pattern(/^\d{10,15}$/)],
        ],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
        country: ["", [Validators.required]],
        termsAccepted: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Check if step 1 fields are valid
  isStep1Valid(): boolean {
    const firstName = this.registerForm.get("firstName");
    const lastName = this.registerForm.get("lastName");
    const email = this.registerForm.get("email");
    const phoneNumber = this.registerForm.get("phoneNumber");
    const username = this.registerForm.get("username");
    const country = this.registerForm.get("country");

    return !!(
      firstName?.valid &&
      lastName?.valid &&
      email?.valid &&
      phoneNumber?.valid &&
      username?.valid &&
      country?.valid
    );
  }

  // Navigate to next step
  nextStep() {
    if (this.isStep1Valid()) {
      this.currentStep = 2;
    } else {
      // Mark step 1 fields as touched to show validation errors
      [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "username",
        "country",
      ].forEach((field) => {
        this.registerForm.get(field)?.markAsTouched();
      });
    }
  }

  // Navigate to previous step
  previousStep() {
    this.currentStep = 1;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError("passwordMismatch")) {
      delete confirmPassword.errors?.["passwordMismatch"];
      if (Object.keys(confirmPassword.errors || {}).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      // Remove confirmPassword and termsAccepted from the data sent to API
      const { confirmPassword, termsAccepted, ...registerData } = formData;

      // Add isActive field as required by the DTO
      const finalRegisterData = {
        ...registerData,
        isActive: true,
      };

      this.authService.register(finalRegisterData).subscribe({
        next: (response) => {
          this.snackBar.open("You have been registered successfully", "Close", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ["my-custom-snackbar"],
          });
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 2000); // Navigate after 2 seconds to allow user to see the message
        },
        error: (error) => {
          console.error("Registration failed:", error);
          this.snackBar.open(
            "Registration failed. Please try again.",
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
      console.log("Form is invalid");
      this.markFormGroupTouched();
    }
  }

  onForgotPassword() {
    this.router.navigateByUrl("/login");
  }

  // Helper method to mark all fields as touched to show validation errors
  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods to check field validity and display errors
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors["required"])
        return `${this.getFieldDisplayName(fieldName)} is required`;
      if (field.errors["email"]) return "Please enter a valid email address";
      if (field.errors["minlength"])
        return `${this.getFieldDisplayName(fieldName)} must be at least ${
          field.errors["minlength"].requiredLength
        } characters`;
      if (field.errors["pattern"]) return "Please enter a valid phone number";
      if (field.errors["passwordMismatch"]) return "Passwords do not match";
      if (field.errors["requiredTrue"])
        return "You must accept the terms and conditions";
    }
    return "";
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: "First Name",
      lastName: "Last Name",
      username: "Username",
      email: "Email",
      phoneNumber: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      country: "Country",
    };
    return displayNames[fieldName] || fieldName;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
