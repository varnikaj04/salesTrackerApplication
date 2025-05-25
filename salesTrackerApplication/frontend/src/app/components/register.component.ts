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
    <div class="register-wrapper">
      <div class="content-container">
        <div class="form-section">
          <h1 class="brand-title">Vehicle Sales Tracker</h1>
          <h2 class="form-title">Register Your Sales Journey</h2>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-group" *ngFor="let field of fields">
              <label [for]="field.controlName">{{ field.label }}</label>
              <input
                [type]="field.type"
                [formControlName]="field.controlName"
                [placeholder]="field.placeholder"
                [id]="field.controlName"
              />
            </div>

            <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
            <div *ngIf="success" class="alert alert-success">{{ success }}</div>

            <button
              type="submit"
              [disabled]="registerForm.invalid"
              class="submit-button"
            >
              Register
            </button>

            <p class="login-redirect">
              Already have an account?
              <a routerLink="/login">Login here</a>
            </p>
          </form>
        </div>

        <div class="image-section">
          <img src="/image6.jpg" alt="Car" />
        </div>
      </div>
    </div>
  `,
  styles: `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');

.register-wrapper {
  background-image: url('/image3.png');
  background-size: cover;
  background-position: center;
  backdrop-filter: blur(6px);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.content-container {
  display: flex;
  flex-direction: row;
  background: rgba(34, 9, 44, 0.92);
  border-radius: 12px;
  overflow: hidden;
  margin-left: 100px;
  max-width: 960px;
  width: 100%;
  height: auto;
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.03);
}

.form-section {
  flex: 1;
  padding: 2rem;
  color: rgb(255, 255, 255);
}

.image-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  color: rgb(248, 75, 84);
  text-align: center;
  margin-bottom: 0.5rem;
}

.form-title {
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: rgb(255, 255, 255);
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  color: rgb(255, 255, 255);
}

.form-group input {
  padding: 0.6rem;
  background-color: #222;
  border: 1px solid #444;
  border-radius: 6px;
  color: rgb(255, 255, 255);
  font-size: 1rem;
}

.form-group input:focus {
  border-color: #202223;
  outline: none;
}

.alert {
  font-size: 0.9rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 4px;
}

.alert-danger {
  background-color: #5a1d1d;
  color: #e50914;
}

.alert-success {
  background-color: #1d5a2f;
  color: #6aff99;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: rgb(248, 75, 84);
  border: none;
  color: rgb(255, 255, 255);
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  transition: background-color 0.3s;
  margin-top: 0.75rem;
}

.submit-button:hover {
  background-color: #bf0811;
}

.login-redirect {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: rgb(255, 255, 255);
}

.login-redirect a {
  color: rgb(248, 75, 84);
  text-decoration: none;
}

.login-redirect a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
    margin-left: 0;
  }

  .image-section {
    height: 200px;
  }
}

  `,
})
export class RegisterComp {
  registerForm!: FormGroup;
  error: string = '';
  success = '';

  fields = [
    {
      controlName: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
      type: 'text',
    },
    {
      controlName: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      type: 'text',
    },
    {
      controlName: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      type: 'email',
    },
    {
      controlName: 'phoneNo',
      label: 'Phone Number',
      placeholder: 'Enter your mobile no',
      type: 'text',
    },
    {
      controlName: 'password',
      label: 'Password',
      placeholder: '********',
      type: 'password',
    },
  ];

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
