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
} from "carbon-components-angular";
import { ERROR_LABELS } from "../../constants/labels";
import { AuthService } from "../../services/auth.service";
import { UserStore } from "../../stores/user.store";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputModule,
    ButtonModule,
    LinkModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error: any = null;
  errorLabels = ERROR_LABELS;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userStore: UserStore // ✅ Inject UserStore
  ) {
    // ✅ Redirect if already logged in
    if (this.userStore.isAuthenticated) {
      this.router.navigate(["/tasks"]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(10)],
      ],
      password: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(10)],
      ],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  getErrors(field: string): string {
    const errors = this.f[field]?.errors;
    return errors ? this.errorLabels[Object.keys(errors)[0]] : "";
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    try {
      await this.authService.login(
        this.f["username"].value,
        this.f["password"].value
      );
      this.router.navigateByUrl("/tasks");
    } catch (error: any) {
      this.error = error?.response?.data?.message || "Something went wrong!";
      this.loading = false;
    }
  }
}
