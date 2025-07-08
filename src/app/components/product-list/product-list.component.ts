import { Component, OnInit, Input } from '@angular/core';
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
  @Input() limit: number | null = null;

  // Add these inputs to allow binding from parent (ShopComponent)
  @Input() searchTerm: string = '';
  @Input() sortBy: string = '';
  @Input() viewMode: 'grid' | 'list' = 'grid';

  products: Toy[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getToys().subscribe({
      next: (data) => {
        console.log('Fetched toys:', data);
        this.products = this.limit ? data.slice(0, this.limit) : data;
      },
      error: (err) => {
        console.error('Error fetching toys:', err);
      }
    });
  }
}
