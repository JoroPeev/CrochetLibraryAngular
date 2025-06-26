import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Toy } from '../models/toys';
import { ToyImage } from '../models/toys';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:7298/api'; // Changed from apiUrl to baseUrl for clarity

  private toysUrl = `${this.baseUrl}/Toys`; // Path for toy-related operations
  private requestsApiUrl = `${this.baseUrl}/Requests`; // Path for requests

  constructor(private http: HttpClient) {}

  getToys(): Observable<Toy[]> {
    return this.http.get<Toy[]>(this.toysUrl);
  }

  addRequest(requestData: any): Observable<any> {
    return this.http.post(this.requestsApiUrl, requestData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  createToy(toy: Toy): Observable<any> {
    return this.http.post(`${this.toysUrl}`, toy);
  }
  
  updateToy(id: string, toy: Toy) {
    return this.http.put(`${this.toysUrl}/${id}`, toy);
  }

  deleteToy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.toysUrl}/${id}`);
  }

  updateToyImage(toyId: string, imageId: string, toyImage: ToyImage): Observable<ToyImage> {
    return this.http.put<ToyImage>(`${this.toysUrl}/${toyId}/images/${imageId}`, toyImage);
  }

  getToyImages(toyId: string): Observable<ToyImage[]> {
    return this.http.get<ToyImage[]>(`${this.toysUrl}/${toyId}/images`);
  }

  postToyImage(toyId: string, toyImage: ToyImage): Observable<ToyImage> {
    return this.http.post<ToyImage>(`${this.toysUrl}/${toyId}/images`, toyImage);
  }

  deleteToyImage(toyId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.toysUrl}/${toyId}/images/${imageId}`);
  }

}