import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  products: Product[] = [
    { id: 1, name: 'Teddy Bear', price: 25, imageUrl: 'assets/teddy.jpg' },
    { id: 2, name: 'Yarn Ball', price: 10, imageUrl: 'assets/yarn.jpg' },
  ];

  newProduct: Product = { id: 0, name: '', price: 0, imageUrl: '' };
  editMode = false;
  selectedProduct: Product | null = null;

  addProduct() {
    const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const productToAdd = { ...this.newProduct, id: newId };
    this.products.push(productToAdd);
    this.newProduct = { id: 0, name: '', price: 0, imageUrl: '' };
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.editMode = true;
  }

  saveProduct() {
    if (this.selectedProduct) {
      const index = this.products.findIndex(p => p.id === this.selectedProduct!.id);
      if (index !== -1) {
        this.products[index] = this.selectedProduct;
      }
      this.cancelEdit();
    }
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedProduct = null;
  }
}
