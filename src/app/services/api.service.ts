import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private toysApiUrl = 'https://localhost:7298/api/Toys';
  private authApiUrl = 'https://localhost:7298/api/auth'; // <-- Auth API endpoint

  constructor(private http: HttpClient) {}

  // Fetch toys
  getToys(): Observable<any> {
    return this.http.get<any>(this.toysApiUrl);
  }

  // Login method
  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/login`, data);
  }
}
