import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toys } from '../../models/toys';
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
  @Input() product!: Toys;

  showRequestModal = false;

  requestData = {
    name: '',
    email: '',
    message: '',
    dueDate: ''
  };

  constructor(private apiService: ApiService) {}

  openRequestModal() {
    this.showRequestModal = true;
  }

  closeRequestModal() {
    this.showRequestModal = false;
    this.resetForm();
  }

  submitRequest() {
    const request = {
      toyId: this.product.id,
      ...this.requestData
    };

    this.apiService.addRequest(request).subscribe({
      next: () => {
        alert('Request sent successfully!');
        this.closeRequestModal();
      },
      error: (err) => {
        console.error('Error sending request:', err);
        alert('There was a problem sending your request.');
      }
    });
  }

  resetForm() {
    this.requestData = {
      name: '',
      email: '',
      message: '',
      dueDate: ''
    };
  }
}
