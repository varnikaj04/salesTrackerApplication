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

        <!-- <div class="mb-3">
          <label class="form-label">Sale Date</label>
          <input formControlName="saleDate" type="date" class="form-control" />
          <div *ngIf="saleForm.get('saleDate')?.touched && saleForm.get('saleDate')?.invalid">
            <small class="text-danger">Sale Date is required.</small>
          </div>
        </div> -->

        <button class="btn btn-primary" type="submit" [disabled]="saleForm.invalid">Submit</button>
      </form>
    </div>
  `,
  styles: [`
  .container {
    max-width: 750px;
    margin: 0 auto;
    padding: 3rem 2rem;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  h2 {
    color: #2d3436;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .form-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .form-control {
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 0.6rem 0.75rem;
    font-size: 1rem;
    transition: border-color 0.2s ease-in-out;
  }

  small.text-danger {
    font-size: 0.85rem;
    color: #e50914;
  }

  .btn-primary {
    background-color: #e50914;
    border: none;
    padding: 10px 24px;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 8px;
    color: #fff;
    transition: background-color 0.2s ease;
  }

  .btn-primary:hover {
    background-color: rgb(188, 16, 24);
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
    //   saleDate: new FormControl('', Validators.required),
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
