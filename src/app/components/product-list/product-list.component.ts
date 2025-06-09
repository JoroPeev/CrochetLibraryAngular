import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Toy } from '../../models/toys';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Toy[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getToys().subscribe({
      next: (data) => {
        console.log('Fetched toys:', data);
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching toys:', err);
      }
    });
  }
}
