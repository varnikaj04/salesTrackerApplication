import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="login-page">
      <h1 class="app-title">Sales Tracker Application</h1>
      <div
        class="d-flex align-items-center justify-content-start h-100 container"
      >
        <div class="row">
          <div>
            <div class="login-box p-4 shadow rounded bg-white">
              <h3 class="text-center mb-4 display-4">Login</h3>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="p-2">
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
                  [disabled]="loginForm.invalid"
                >
                  Login
                </button>

                <p class="text-center mt-3 mb-0">
                  Don’t have an account?
                  <a
                    routerLink="/register"
                    class="text-decoration-none text-primary"
                    >Register here</a
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
    .login-page {
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

    .display-4{
        font-family: 'sans-serif';
        font-style: bold;
    }

    .login-box {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    max-width: 550px;
    font-family: 'sans-serif';
    width: 400px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

  `,
})
export class LoginComp {
  loginForm!: FormGroup;
  error: string = '';
  success = '';
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe((res: any) => {
        sessionStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      });
    }
  }
}
