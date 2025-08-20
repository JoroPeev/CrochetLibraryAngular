import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Toy, ToyImage } from '../models/toys';
import { Review } from '../models/toys';
interface ToyImageDto {
  imageUrl: string;
  displayOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:7298/api';
  private toysUrl = `${this.baseUrl}/Toys`;
  private requestsApiUrl = `${this.baseUrl}/Requests`;

  constructor(private http: HttpClient) {}

  getToyById(id: string): Observable<Toy> {
    return this.http.get<Toy>(`${this.toysUrl}/${id}`);
  }

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
  
  updateToy(id: string, toy: Toy): Observable<any> {
    return this.http.put(`${this.toysUrl}/${id}`, toy);
  }

  deleteToy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.toysUrl}/${id}`);
  }

  getToyImages(toyId: string): Observable<ToyImage[]> {
    return this.http.get<ToyImage[]>(`${this.toysUrl}/${toyId}/images`);
  }

  addImagesToToy(toyId: string, imageUrls: string[]): Observable<any> {
    return this.http.post(`${this.toysUrl}/${toyId}/images`, imageUrls);
  }

  updateToyImage(toyId: string, imageId: string, dto: ToyImageDto): Observable<void> {
  return this.http.put<void>(`/api/toys/${toyId}/images/${imageId}`, dto);
  }

  deleteToyImage(toyId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.toysUrl}/${toyId}/images/${imageId}`);
  }
   // --- Reviews ---
  getReviews(toyId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.toysUrl}/${toyId}/reviews`);
  }
  addReview(toyId: string, review: any): Observable<void> {
  return this.http.post<void>(`${this.toysUrl}/${toyId}/reviews`, review);
  }
  deleteReview(toyId: string, reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.toysUrl}/${toyId}/reviews/${reviewId}`);
  }
}
