
 import { Component, OnInit } from '@angular/core';
import { SaleService } from '../services/sales.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from './environment';

@Component({
  selector: 'app-dashboard',
  imports:[CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 px-4">
      <a class="navbar-brand" href="#">Automobile Sales Tracker</a>
      <div class="ms-auto">
    <button class="btn btn-outline-light me-2" (click)="fetchMySales()">My Sales</button>
    <button class="btn btn-outline-light me-2" (click)="fetchSales()">All Sales</button>
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>
    </nav>

    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Welcome, {{ user?.firstName }}</h3>
        <button class="btn btn-primary" (click)="addSale()">+ Add Sale</button>
      </div>
     
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let sale of filteredSales">
          <div class="card h-100 shadow-sm">
            <img
              [src]=" apiUrl+'/'+sale.vehicleimage || '/audi-r8.avif'"
              class="card-img-top"
              alt="Vehicle Image"
              style="height: 180px; object-fit: cover"
            />
            <div class="card-body">
              <h5 class="card-title text-capitalize">{{ sale.vehiclebrand }}</h5>
              <p class="card-text">
                <strong>Amount:</strong> ₹{{ sale.saleamount }} <br />
                <strong>Date:</strong> {{ sale.saledate | date:'longDate' }}
              </p>
              <button class="btn btn-outline-primary btn-sm" (click)="viewDetails(sale._id)">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredSales.length === 0" class="text-center text-muted mt-5">
        <p>No sales available. Click "Add Sale" to create one.</p>
      </div>
    </div>
  `,
  styles: [`

  :host {
    display: block;
    min-height: 100vh;
    background: linear-gradient(135deg, #f9f9f9, #e6e6e6); 
    font-family: 'Roboto', sans-serif; 
    padding-bottom: 60px;
  }


  .container {
    background-color: #ffffff;
    padding: 2rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    margin-top: 30px;
    max-width: 1250px;
  }


  h3 {
    font-style: italic;
    font-weight: 700;
    color: #2c3e50;
    font-size: 1.9rem;
  }


  .navbar {
    background: #ffffff;
    border-bottom: 1px solid #ddd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: 1rem 2rem;
  }

  .navbar-brand {
    font-weight: 700;
    letter-spacing: 0.5px;
    font-size: 1.5rem;
    color: #e50914 ;
    text-transform: uppercase;
    cursor: pointer;
  }

  .navbar .btn {
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 1rem;
  }

  .navbar .btn-outline-light {
    color: #2c3e50;
    border-color: #ccc;
    background-color: #fff;
    transition: all 0.3s;
  }

  .navbar .btn-outline-light:hover {
    background-color: #f1f1f1;
    border-color: #b2b2b2;
    color: #e50914;
  }

  .navbar .btn-danger {
    background-color: #e50914;
    border-color: #e50914;
    font-weight: 700;
    color: white;
  }

  .navbar .btn-danger:hover {
    background-color: #bf0811;
    border-color: #bf0811;
    color: white;
  }

  .card {
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #ffffff;
    border: 1px solid #eee;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  .card-img-top {
    height: 180px;
    object-fit: cover;
    border-bottom: 1px solid #eee;
  }

  .card-body {
    padding: 1rem 1.25rem;
  }

  .card-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2d3436;
    margin-bottom: 0.5rem;
  }

  .card-text {
    font-size: 0.95rem;
    color: #34495e;
  }

  .text-muted {
    font-style: italic;
    font-size: 1rem;
    color: #999;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .card {
      margin-bottom: 1.25rem;
    }

    .navbar .btn {
      margin-bottom: 0.5rem;
    }
  }
`]




})
export class DashboardComp implements OnInit {
  sales: any[] = [];
  filteredSales: any[] = [];
  user: any;
  apiUrl = environment.apiUrl;

  constructor(
    private saleService: SaleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.fetchSales();
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }


fetchSales(): void {
  this.saleService.getAllSales().subscribe({
    next: (res) => {
      this.sales = res;
      this.filteredSales = res;
    },
    error: (err) => {
      console.error('Failed to load all sales from server:', err);
      this.sales = [];
      this.filteredSales = [];
    },
  });
}


  fetchMySales(): void {
    this.saleService.getSalesByUser(this.user._id).subscribe({
      next: (res) => {
        this.sales = res;
        this.filteredSales = res;
      },
      error: (err) => {
        console.error('Failed to load user sales:', err);
        this.sales = [];
        this.filteredSales = [];
      },
    });
  }
  logout(): void {
    this.authService.logout();
  }

  addSale(): void {
    this.router.navigate(['/add-sale']);
  }

  viewDetails(saleId: string): void {
    this.router.navigate(['/sale-detail', saleId]);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  onBrandInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const brand = input.value.toLowerCase();
  }
}
