import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Toys } from '../../models/toys';

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

  openRequestModal() {
    this.showRequestModal = true;
  }

  closeRequestModal() {
    this.showRequestModal = false;
  }

  submitRequest() {
    console.log('Request submitted:', this.requestData);
    alert(`Request sent for ${this.product.name}. Due: ${this.requestData.dueDate}`);
    this.requestData = { name: '', email: '', message: '', dueDate: '' };
    this.closeRequestModal();
  }
}
