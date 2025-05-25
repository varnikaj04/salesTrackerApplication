import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService } from '../services/sales.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from './environment';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a class="navbar-brand" (click)="goToHome()">Automobile Sales Tracker</a>
      <div class="ms-auto">
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>
    </nav>
    <div class="detail-container">
      <div class="detail-card">
        <img
          [src]="sale?.vehicleimage ? apiUrl + '/' + sale.vehicleimage : '/audi-r8.avif'"
          alt="Vehicle Image"
          class="vehicle-img"
        />

        <div class="info-section">
          <h2>
            {{ sale?.vehiclebrand }} {{ sale?.vehiclemodel }} ({{
              sale?.vehicleyear
            }})
          </h2>
          <p>
            <strong>Sale Date:</strong> {{ sale?.saledate | date : 'longDate' }}
          </p>
          <p><strong>Sale Amount:</strong> ₹{{ sale?.saleamount }}</p>
          <p><strong>Customer Name:</strong> {{ sale?.customername }}</p>
          <p><strong>Email:</strong> {{ sale?.customeremail }}</p>
          <p><strong>Phone:</strong> {{ sale?.customerphone }}</p>
          <p><strong>Salesperson Name :</strong> {{ salespersonName }}</p>
        </div>

        <div class="action-buttons mt-4" *ngIf="isOwner()">
          <button class="btn btn-warning me-2" (click)="editSale()">
            Edit
          </button>
          <button class="btn btn-danger" (click)="deleteSale()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [
  `
    .detail-container {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
      background-color: rgb(162, 160, 160);
      min-height: 100vh;
      margin-top: 0px;
    }

    .detail-card {
      max-width: 900px;
      width: 100%;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      padding: 32px; 
      animation: fadeIn 0.4s ease-in-out;
    }

    .vehicle-img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 24px; 
    }

    .info-section h2 {
      font-size: 32px; 
      font-weight: 600;
      color: #2d3436;
      margin-bottom: 16px; 
      margin-top: 16px; 
    }

    .info-section p {
      font-size: 17px; 
      margin-bottom: 9px; 
      color: #333;
    }

    .action-buttons {
      text-align: right;
    }

    .navbar {
    background-color: #ffffff;
    border-bottom: 1px solid #dedede;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    padding: 12px 24px;
    }

    .navbar-brand {
    font-weight: 700;
    font-size: 1.6rem;
    letter-spacing: 0.6px;
    color: #e50914 !important;
    cursor: pointer;
    text-transform: uppercase;
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

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
],
})
export class SaleDetailComponent implements OnInit {
  sale: any;
  currentUser: any;
  saleId: string = '';
  apiUrl = environment.apiUrl;
  salespersonName: string = '';
  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.saleId = this.route.snapshot.paramMap.get('id') || '';

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.fetchSaleDetails();
      },
      error: () => this.router.navigate(['/login']),
    });
  }

  fetchSaleDetails(): void {
    this.saleService.getSaleById(this.saleId).subscribe({
      next: (saleData) => {
        this.sale = saleData;
        this.getSalesPerson();
      },
      error: (err) => {
        console.error('Error fetching sale details:', err);
      },
    });
  }

  getSalesPerson(): void {
    if (!this.sale?.salespersonid) {
    this.salespersonName = 'Unknown Salesperson';
    return;
  }
  this.saleService.getUserById(this.sale.salespersonid).subscribe({
    next: (user:any) => {
      this.salespersonName = `${user.firstName} ${user.lastName}`;
      console.log(this.salespersonName);  
    },
    error: () => {
      this.salespersonName = 'Unknown Salesperson';
    }
  });
  }

  deleteSale(): void {
    if (confirm('Are you sure you want to delete this sale?')) {
      this.saleService.deleteSale(this.saleId).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => console.error('Error deleting sale:', err),
      });
    }
  }
  logout(): void {
    this.authService.logout();
  }
  editSale(): void {
    this.router.navigate(['/edit-sale', this.saleId]);
  }
  goToHome(): void {
    this.router.navigate(['/home']);
  }
  

  isOwner(): boolean {
    return this.currentUser?._id === this.sale?.salespersonid;
  }
}
