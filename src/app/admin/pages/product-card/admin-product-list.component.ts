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
  newProduct: Partial<Toys> = {};
  showAddForm: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getToys().subscribe({
      next: (data) => {
        this.toys = data;
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        alert('Failed to load products.');
      }
    });
  }

  // Add new toy methods
  showAddToyForm() {
    this.showAddForm = true;
    this.resetNewProduct();
  }

  hideAddToyForm() {
    this.showAddForm = false;
    this.resetNewProduct();
  }

  resetNewProduct() {
    this.newProduct = {
      name: '',
      price: 0,
      imageUrl: '',
      description: ''
    };
  }

  addToy() {
    // Validation
    if (!this.newProduct.name || !this.newProduct.price || this.newProduct.price <= 0) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    // Ensure price is properly formatted
    if (this.newProduct.price) {
      this.newProduct.price = Math.round(this.newProduct.price * 100) / 100;
    }

    console.log('Adding new toy:', this.newProduct);

    this.apiService.createToy(this.newProduct as Toys).subscribe({
      next: (response) => {
        console.log('Add response:', response);
        alert('Product added successfully!');
        this.loadProducts();
        this.hideAddToyForm();
      },
      error: (error) => {
        console.error('Failed to add product:', error);
        alert('Failed to add product: ' + (error.message || 'Unknown error'));
      }
    });
  }

  // Existing methods
  editProduct(toy: Toys) {
    this.editingProduct = { ...toy };
  }

  saveProduct() {
    if (!this.editingProduct) {
      console.error('No product being edited');
      return;
    }

    // Add validation
    if (!this.editingProduct.name || !this.editingProduct.price || this.editingProduct.price <= 0) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    // Ensure price is properly formatted
    if (this.editingProduct.price) {
      this.editingProduct.price = Math.round(this.editingProduct.price * 100) / 100;
    }

    console.log('Saving product:', this.editingProduct);

    this.apiService.updateToy(this.editingProduct.id, this.editingProduct).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        alert('Product updated successfully!');
        this.loadProducts();
        this.editingProduct = null;
      },
      error: (error) => {
        console.error('Failed to update product:', error);
        alert('Failed to update product: ' + (error.message || 'Unknown error'));
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteToy(id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product.');
        }
      });
    }
  }

  cancelEdit() {
    this.editingProduct = null;
  }
}