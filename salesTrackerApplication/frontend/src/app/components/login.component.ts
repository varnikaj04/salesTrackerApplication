import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <h3 class="text-center mb-4">Login</h3>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label>Email</label>
              <input
                type="email"
                formControlName="email"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label>Password</label>
              <input
                type="password"
                formControlName="password"
                class="form-control"
              />
            </div>
            <button
              class="btn btn-primary w-100"
              [disabled]="loginForm.invalid"
            >
              Login
            </button>
            <p class="text-center mt-3">
              Don't have an account? <a routerLink="/register">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComp {
  loginForm!: FormGroup;

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
