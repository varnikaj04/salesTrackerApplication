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
 
styles: [`
  :host {
    display: block;
    background: linear-gradient(135deg, #1c0823, #3c0a3e, #ff7e42);
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    color: #fdfcfa;
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


  .detail-container {
    display: flex;
    justify-content: center;
    padding: 48px 24px;
    background-color: transparent;
    min-height: 100vh;
  }


  .detail-card {
    max-width: 960px;
    width: 100%;
    background: rgba(34, 10, 40, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    box-shadow: 0 0 40px rgba(255, 100, 60, 0.15);
    padding: 36px;
    color: #fefefe;
    animation: fadeIn 0.6s ease-in-out;
    backdrop-filter: blur(5px);
  }

  /* Image */
  .vehicle-img {
    width: 100%;
    height: 420px;
    object-fit: cover;
    border-radius: 14px;
    margin-bottom: 28px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.55);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .vehicle-img:hover {
    transform: scale(1.015);
    box-shadow: 0 12px 26px rgba(255, 126, 66, 0.3);
  }


  .info-section h2 {
    font-size: 34px;
    font-weight: 800;
    color: #ff7e42;
    margin: 20px 0 12px;
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 6px rgba(255, 126, 66, 0.5);
  }

  .info-section p {
    font-size: 18px;
    margin-bottom: 10px;
    color: #e9e9e9;
    line-height: 1.7;
  }


  .action-buttons {
    text-align: right;
    margin-top: 24px;
  }

  .action-buttons .btn {
    margin-left: 12px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .action-buttons .btn-danger {
    background-color: #ff7043;
    border-color: #ff7043;
  }

  .action-buttons .btn-danger:hover {
    background-color: #d8521a;
    border-color: #d8521a;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`]


  

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
