import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toy } from '../../models/toys';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Toy;

  showRequestModal = false;

  requestData = {
    name: '',
    email: '',
    message: '',
    dueDate: ''
  };

  currentImageIndex = 0;

  constructor(private apiService: ApiService) {}

  get currentImage(): string {
    if (!this.product || !this.product.imageUrls.length) {
      return '';
    }
    return this.product.imageUrls[this.currentImageIndex];
  }

  prevImage(): void {
    if (!this.product) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
  }

  nextImage(): void {
    if (!this.product) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imageUrls.length;
  }

  openRequestModal(): void {
    this.showRequestModal = true;
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
    this.resetForm();
  }

  submitRequest(): void {
    if (!this.product) {
      alert('Product information is missing.');
      return;
    }

    const request = {
      toyId: this.product.id,
      ...this.requestData
    };

    this.apiService.addRequest(request).subscribe({
      next: () => {
        alert('Request sent successfully!');
        this.closeRequestModal();
      },
      error: (error) => {
        console.error('Error sending request:', error);
        alert('There was a problem sending your request.');
      }
    });
  }

  resetForm(): void {
    this.requestData = {
      name: '',
      email: '',
      message: '',
      dueDate: ''
    };
  }
}
