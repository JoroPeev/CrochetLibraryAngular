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
  addRequest(requestData: any): Observable<any> {
    return this.http.post(this.requestsApiUrl, requestData);
  }
  login(credentials: any): Observable<any> {
    return this.http.post('https://localhost:7298/api/auth/login', credentials);
  }
  addToy(toy: Toys): Observable<any> {
    return this.http.post(this.apiUrl, toy);
  }

  updateToy(id: number, toy: Toys): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, toy);
  }

  deleteToy(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
