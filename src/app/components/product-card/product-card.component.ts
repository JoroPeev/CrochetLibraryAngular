import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Toys } from '../../models/toys';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  products: Toys[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getToys().subscribe(data => {
      this.products = data;
    });
  }
}
