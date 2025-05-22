import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Toys } from '../../../models/toys';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminProductListComponent implements OnInit {
  toys: Toys[] = [];
  editingProduct: Toys | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getToys().subscribe(data => {
      this.toys = data;
    });
  }

  editProduct(product: Toys) {
    this.editingProduct = { ...product };
  }

  saveProduct() {
    if (this.editingProduct) {
      this.apiService.updateToy(this.editingProduct.id, this.editingProduct)
        .subscribe(() => {
          this.editingProduct = null;
          this.loadProducts();
        });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteToy(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  cancelEdit() {
    this.editingProduct = null;
  }
}
