import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Toys } from '../models/toys';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7149/api/Toys';  // Example

  constructor(private http: HttpClient) {}

  getToys(): Observable<Toys[]> {
    return this.http.get<Toys[]>(this.apiUrl);
  }
}
