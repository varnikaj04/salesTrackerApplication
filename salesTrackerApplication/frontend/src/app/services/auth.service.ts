import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = 'http://localhost:3030';
 
  constructor(private http: HttpClient, private router: Router) {}
 
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/register`, data, {
      withCredentials: true,
    });
  }
 
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, credentials, {
      withCredentials: true,
    });
  }
 
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiURL}/me`, { withCredentials: true });
  }

  logout(): void {
    this.http.post(`${this.apiURL}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
 
  
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }
 
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
 
  setSession(userId: string, token: string): void {
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('token', token);
  }
 
  getUserId(): string {
    return sessionStorage.getItem('userId') || '';
  }
}