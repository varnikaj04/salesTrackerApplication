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
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <h3 class="text-center mb-4">Register</h3>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label>First Name</label>
              <input formControlName="firstName" class="form-control" />
            </div>
            <div class="mb-3">
              <label>Last Name</label>
              <input formControlName="lastName" class="form-control" />
            </div>
            <div class="mb-3">
              <label>Email</label>
              <input
                type="email"
                formControlName="email"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label>Phone No</label>
              <input formControlName="phoneNo" class="form-control" />
            </div>
            <div class="mb-3">
              <label>Password</label>
              <input
                type="password"
                formControlName="password"
                class="form-control"
              />
            </div>
            <div *ngIf="error" class="text-danger mb-2">{{ error }}</div>
            <div *ngIf="success" class="alert alert-success mt-2">
              {{ success }}
            </div>
            <button
              class="btn btn-success w-100"
              [disabled]="registerForm.invalid"
            >
              Register
            </button>
            <p class="text-center mt-3">
              Already have an account? <a routerLink="/login">Go To Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
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
//   async onSubmit(): Promise<void> {
//     if (this.registerForm.valid) {
//       try {
//         const response = await this.auth.register(this.registerForm.value);
//         this.success = response.data.message || 'Registration successful!';
//         this.error = '';
//         this.registerForm.reset();

//         setTimeout(() => this.router.navigate(['/login']), 2500);
//       } catch (err: any) {
//         console.error('Axios error:', err);
//         this.success = '';
//         this.error = err.response?.data?.error || 'Registration failed';
//       }
//     }
//   }

    onSubmit(): void {
      if (this.registerForm.valid) {
        this.auth.register(this.registerForm.value).subscribe({
          next: (res) => {
              // console.log(res);

            this.success = res.message || 'Registration successful!';
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
