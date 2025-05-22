import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-admin-product-edit',
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Edit Product</h1>
    <form (ngSubmit)="saveProduct()">
      <label>Name:</label>
      <input [(ngModel)]="product.name" name="name">

      <label>Price:</label>
      <input type="number" [(ngModel)]="product.price" name="price">

      <button type="submit">Save</button>
      <button type="button" (click)="cancel()">Cancel</button>
    </form>
  `
})
export class ProductEditComponent {
  product = { id: 0, name: '', price: 0 };

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = this.route.snapshot.params['id'];
    // Here you would load the product by ID from your service.
    this.product.id = id;
    this.product.name = 'Sample Product';
    this.product.price = 20;
  }

  saveProduct() {
    alert('Product saved!');
    this.router.navigate(['/admin/products']);
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
