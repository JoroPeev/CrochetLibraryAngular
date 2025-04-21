// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // <-- Make sure you import Observable

@Injectable({
  providedIn: 'root' // Makes ApiService available throughout the app
})
export class ApiService {

  // Your API base URL (change this to match your actual backend URL)
  private apiUrl = 'https://localhost:7298/api/Toys'; // <-- Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  // This is the getToys method to fetch toy data from your backend
  getToys(): Observable<any> {
    return this.http.get<any>(this.apiUrl);  // <-- This calls your API and gets the toys
  }
}
