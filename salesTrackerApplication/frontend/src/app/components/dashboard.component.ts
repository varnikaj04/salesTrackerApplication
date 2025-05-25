
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
              <button class="btn btn-primary btn-sm" (click)="viewDetails(sale._id)">
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
  styles:`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');

:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg,rgb(78, 40, 111), #5e335d, #ec704c);
  font-family: 'Segoe UI', sans-serif;
  color: #f2f2f2;
  padding-bottom: 60px;
}


.navbar {
  background: rgba(20, 14, 25, 0.85);
  padding: 1rem 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
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

.navbar .btn {
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1rem;
  color: #ffffff;
}

.navbar .btn-outline-light {
  background-color: transparent;
  border: 1px solid #999;
  color: #f2f2f2;
  transition: all 0.3s;
}

.navbar .btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #f8675e;
  color: #f8675e;
}

.navbar .btn-danger {
  background-color: #f8675e;
  border: none;
  color: white;
}

.navbar .btn-danger:hover {
  background-color: #c03a2b;
}


.container {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 0 28px rgba(0, 0, 0, 0.25);
  margin: 2rem auto;
  max-width: 1250px;
}

h3 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 1.9rem;
  color: #ff6b5c;
  margin-bottom: 1.5rem;
}


.card {
  border-radius: 14px;
  background: rgba(44, 20, 59, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  color: #ffffff;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(255, 104, 91, 0.2);
}

.card-img-top {
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.card-body {
  padding: 1rem 1.25rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff6b5c;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.95rem;
  color: #ddd;
}

.text-muted {
  font-style: italic;
  font-size: 1rem;
  color: #bbb;
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

  `




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
