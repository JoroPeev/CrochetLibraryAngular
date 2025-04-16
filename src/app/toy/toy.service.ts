import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Toy {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  colors: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToyService {
  private apiUrl = 'https://localhost:7298/api/Toys';

  constructor(private http: HttpClient) {}

  getToys(): Observable<Toy[]> {
    return this.http.get<Toy[]>(this.apiUrl);
  }
}
