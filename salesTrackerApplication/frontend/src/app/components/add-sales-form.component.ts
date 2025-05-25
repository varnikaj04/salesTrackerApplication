import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sales-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  template: `
     <div class="host">
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a class="navbar-brand" (click)="goToHome()">Automobile Sales Tracker</a>
      <div class="ms-auto">
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>
    </nav>

     <div class="container mt-4">
      <h2>Add a Sale</h2>
      <form [formGroup]="saleForm" (ngSubmit)="onSubmit()" enctype="multipart/form-data">

        <div class="mb-3">
          <label class="form-label">Customer Name</label>
          <input formControlName="customername" class="form-control" />
          <div *ngIf="saleForm.get('customername')?.touched && saleForm.get('customername')?.invalid">
            <small class="text-danger">Customer Name is required.</small>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Customer Email</label>
          <input formControlName="customeremail" class="form-control" />
          <div *ngIf="saleForm.get('customeremail')?.touched && saleForm.get('customeremail')?.invalid">
            <small class="text-danger" *ngIf="saleForm.get('customeremail')?.errors?.['required']">Email is required.</small>
            <small class="text-danger" *ngIf="saleForm.get('customeremail')?.errors?.['email']">Invalid email address.</small>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Customer Phone</label>
          <input formControlName="customerphone" class="form-control" />
          <div *ngIf="saleForm.get('customerphone')?.touched && saleForm.get('customerphone')?.invalid">
            <small class="text-danger" *ngIf="saleForm.get('customerphone')?.errors?.['required']">Phone is required.</small>
            <small class="text-danger" *ngIf="saleForm.get('customerphone')?.errors?.['pattern']">Must be 10 digits.</small>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Vehicle Brand</label>
          <input formControlName="vehiclebrand" class="form-control" />
          <div *ngIf="saleForm.get('vehiclebrand')?.touched && saleForm.get('vehiclebrand')?.invalid">
            <small class="text-danger">Vehicle Brand is required.</small>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Vehicle Model</label>
          <input formControlName="vehiclemodel" class="form-control" />
          <div *ngIf="saleForm.get('vehiclemodel')?.touched && saleForm.get('vehiclemodel')?.invalid">
            <small class="text-danger">Vehicle Model is required.</small>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Vehicle Year</label>
          <input formControlName="vehicleyear" type="number" class="form-control" />
          <div *ngIf="saleForm.get('vehicleyear')?.touched && saleForm.get('vehicleyear')?.invalid">
            <small class="text-danger" *ngIf="saleForm.get('vehicleyear')?.errors?.['required']">Year is required.</small>
            <small class="text-danger" *ngIf="saleForm.get('vehicleyear')?.errors?.['min']">Min year: 1900</small>
            <small class="text-danger" *ngIf="saleForm.get('vehicleyear')?.errors?.['max']">Year cannot be in the future</small>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Vehicle Image</label>
          <input type="file" (change)="onFileSelected($event)" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Sale Amount</label>
          <input formControlName="saleamount" type="number" class="form-control" />
          <div *ngIf="saleForm.get('saleamount')?.touched && saleForm.get('saleamount')?.invalid">
            <small class="text-danger" *ngIf="saleForm.get('saleamount')?.errors?.['required']">Amount is required.</small>
            <small class="text-danger" *ngIf="saleForm.get('saleamount')?.errors?.['min']">Amount must be greater than 0</small>
          </div>
        </div>

     

        <button class="btn btn-primary" type="submit" [disabled]="saleForm.invalid">Submit</button>
      </form>
    </div>
     </div>
  `,
  styles: [`
  .host{
    background: linear-gradient(135deg,rgb(78, 40, 111), #5e335d, #ec704c);
  }
 .container {
  max-width: 750px;
  margin: 2rem auto;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(24, 10, 36, 0.95), rgba(66, 28, 49, 0.95));
  border-radius: 16px;
  box-shadow:
    0 12px 32px rgba(255, 105, 60, 0.15),
    0 4px 16px rgba(255, 142, 105, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #f3e8f4;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease-in-out;
}


  .navbar {
    background-color: rgba(28, 8, 35, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    padding: 14px 28px;
  }

  .navbar-brand {
    font-family: 'Orbitron', sans-serif;
    font-weight: 800;
    font-size: 1.7rem;
    letter-spacing: 1px;
    color: #ff7e42 !important;
    text-shadow: 0 0 10px rgba(255, 126, 66, 0.6);
    text-transform: uppercase;
    cursor: pointer;
  }

  .navbar .btn-danger {
    background-color: #ff7e42;
    border-color: #ff7e42;
    font-weight: 700;
    color: white;
    box-shadow: 0 0 12px rgba(255, 126, 66, 0.3);
  }

  .navbar .btn-danger:hover {
    background-color: #e05a1c;
    border-color: #e05a1c;
  }


  h2 {
    color: #ffb366;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.8rem;
    text-align: center;
    text-shadow: 0 0 6px rgba(255, 145, 0, 0.35);
  }

  .form-label {
    font-weight: 600;
    color: #ffd2a6;
    margin-bottom: 0.5rem;
  }

  .form-control {
    border-radius: 8px;
    border: 1px solid #ff8b73;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 0.65rem 0.75rem;
    font-size: 1rem;
    color: #fff;
    transition: border-color 0.2s ease-in-out, background-color 0.3s;
  }

  .form-control:focus {
    border-color: #ffa07a;
    background-color: rgba(255, 255, 255, 0.08);
    outline: none;
  }

  small.text-danger {
    font-size: 0.85rem;
    color: #ff4d4d;
  }

  .btn-primary {
    background: linear-gradient(to right, #ff6f61, #ff914d);
    border: none;
    padding: 10px 24px;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 10px;
    color: #fff;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 111, 97, 0.4);
  }

  .btn-primary:hover {
    background: linear-gradient(to right, #d65050, #ff7e42);
    box-shadow: 0 0 16px rgba(255, 126, 66, 0.6);
  }

  @media (max-width: 576px) {
    .container {
      padding: 2rem 1rem;
    }
  }
`]


})
export class AddSalesFormComponent implements OnInit {
  saleForm!: FormGroup;
  selectedFile!: File;
  currentUser: any;

  constructor(private http: HttpClient,private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router) {}


      logout(): void {
    this.authService.logout();
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
  

  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: () => this.router.navigate(['/login']),
    });

    this.saleForm = new FormGroup({
      customername: new FormControl('', Validators.required),
      customeremail: new FormControl('', [Validators.required, Validators.email]),
      customerphone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      vehiclebrand: new FormControl('', Validators.required),
      vehiclemodel: new FormControl('', Validators.required),
      vehicleyear: new FormControl('', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]),
      saleamount: new FormControl('', [Validators.required, Validators.min(1)]),

    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.saleForm.invalid) return;

    const formData = new FormData();
    const formValue = this.saleForm.value;

    console.log(this.authService.getToken());
    

    Object.entries(formValue).forEach(([key, value]) => {
      formData.append(key, value as string);
    });



    formData.append('salespersonid', this.currentUser._id);

    if (this.selectedFile) {
      formData.append('vehicleimage', this.selectedFile);
    }

    this.http.post('http://localhost:3030/sales', formData).subscribe({
      next: (res) => {
        console.log('Sale submitted:', res)
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Error submitting sale:', err)
    });
  }
}
