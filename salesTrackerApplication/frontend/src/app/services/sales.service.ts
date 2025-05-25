import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private baseURL = 'http://localhost:3030';

  constructor(private http: HttpClient) {}

getSalesByUser(userId: string) {
  return this.http.get<any[]>(`http://localhost:3030/sales/${userId}`, { withCredentials: true });
}
getAllSales() {
  return this.http.get<any[]>(`http://localhost:3030/sales`, { withCredentials: true });
}
getUserById(userId: string){
  return this.http.get<any[]>(`http://localhost:3030/user/${userId}`, { withCredentials: true });
}

getSaleById(id: string): Observable<any> {
  return this.http.get(`${this.baseURL}/sale/${id}`, { withCredentials: true });
}

deleteSale(id : string) : Observable<any> {
  return this.http.delete(`${this.baseURL}/sale/${id}`, { withCredentials: true });
}

  createSale(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/`, data);
  }
}
