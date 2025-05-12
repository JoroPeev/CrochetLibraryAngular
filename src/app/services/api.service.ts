import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Toys } from '../models/toys';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7298/api/Toys';
  private requestsApiUrl = 'https://localhost:7298/api/Requests'; // <-- new endpoint for requests

  constructor(private http: HttpClient) {}

  getToys(): Observable<Toys[]> {
    return this.http.get<Toys[]>(this.apiUrl);
  }

  // 🚀 Add this method here
  addRequest(requestData: any): Observable<any> {
    return this.http.post(this.requestsApiUrl, requestData);
  }
}
