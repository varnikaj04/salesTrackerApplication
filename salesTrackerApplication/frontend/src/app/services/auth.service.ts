import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
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

  // async register(userData: any): Promise<any> {
  //   return axios.post(`${this.apiURL}/register`, userData, {
  //     withCredentials: true,
  //   });
  // }

  // async login(credentials: any): Promise<any> {
  //   return axios.post(`${this.apiURL}/login`, credentials, {
  //     withCredentials: true,
  //   });
  // }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
