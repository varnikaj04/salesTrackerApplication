import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  template: `
    <div class="register-page">
      <h1 class="app-title">Sales Tracker Application</h1>
      <div
        class="d-flex align-items-center justify-content-start h-100 container"
      >
        <div class="row">
          <div>
            <div class="form-wrapper p-4 shadow-lg rounded bg-white">
              <h3 class="text-center text-primary mb-4 display-6">
                Create Your Account
              </h3>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">First Name</label>
                  <input
                    type="text"
                    formControlName="firstName"
                    class="form-control"
                    placeholder="John"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Last Name</label>
                  <input
                    type="text"
                    formControlName="lastName"
                    class="form-control"
                    placeholder="Doe"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    formControlName="email"
                    class="form-control"
                    placeholder="you@example.com"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Phone No</label>
                  <input
                    type="text"
                    formControlName="phoneNo"
                    class="form-control"
                    placeholder="1234567890"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    formControlName="password"
                    class="form-control"
                    placeholder="********"
                  />
                </div>

                <div *ngIf="error" class="alert alert-danger py-2">
                  {{ error }}
                </div>
                <div *ngIf="success" class="alert alert-success py-2">
                  {{ success }}
                </div>

                <button
                  class="btn btn-primary w-100 mt-2"
                  [disabled]="registerForm.invalid"
                >
                  Register
                </button>

                <p class="text-center mt-3 mb-0">
                  Already have an account?
                  <a
                    routerLink="/login"
                    class="text-primary text-decoration-none"
                    >Login here</a
                  >
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .register-page {
    position: relative;
    height: 100vh;
    background: url('/login-bg.avif') no-repeat center center fixed;
    background-size: cover;
    }

    .app-title {
    position: absolute;
    top: 40px;
    left: 80px;
    font-size: 3rem;
    font-weight: 700;
    font-style: italic;
    font-family: 'sans-serif';
    color: #ffffff;
    z-index: 10;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
    }

    .display-6{
    font-family: 'sans-serif';
            font-style: bold;
    }

    .form-wrapper {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    max-width: 550px;
    font-family: 'sans-serif';
    width: 400px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

  `,
})
export class RegisterComp {
  registerForm!: FormGroup;
  error: string = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl(''),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).subscribe({
        next: (res) => {
          // console.log(res);

          this.success =
            res.message || 'Registration successful! Redirecting to Login!';
          this.error = '';
          this.registerForm.reset();

          setTimeout(() => this.router.navigate(['/login']), 2500);
        },
        error: (err) => {
          this.success = '';
          this.error = err.error?.error || 'Registration failed';
        },
      });
    }
  }
}
