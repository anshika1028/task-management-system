import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  ButtonModule,
  InputModule,
  LinkModule,
  RadioModule,
  SelectModule,
} from "carbon-components-angular";
import { ERROR_LABELS } from "../../constants/labels";
import { AuthService } from "../../services/auth.service";
import { MetaStore } from "../../stores/meta.store";
import { UserStore } from "../../stores/user.store";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputModule,
    ButtonModule,
    LinkModule,
    SelectModule,
    RadioModule,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = "";
  successMsg = "";
  errorLabels = ERROR_LABELS;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userStore: UserStore,
    private authService: AuthService,
    private metaStore: MetaStore // ✅ Inject MetaStore to access public holidays
  ) {
    // ✅ Redirect to home if already logged in
    if (this.userStore.isAuthenticated) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],
      role: ["", [Validators.required]],
    });
  }

  // ✅ Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  get roles() {
    return this.metaStore.roles ?? [];
  }

  getErrors(field: string): string {
    const errors = this.f[field]?.errors;
    return errors ? this.errorLabels[Object.keys(errors)[0]] : "";
  }

  capitalizeText(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  async onSubmit() {
    this.submitted = true;

    // ✅ Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    try {
      await this.authService.register(
        this.f["username"].value,
        this.f["password"].value,
        this.f["role"].value
      );

      // ✅ Show success message & redirect to login
      this.loading = false;
      this.error = "";
      this.successMsg = "Registration Successful! Redirecting to login page...";
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 2000);
    } catch (error: any) {
      this.error = error?.message || "Registration failed";
      this.successMsg = "";
      this.loading = false;
    }
  }
}
