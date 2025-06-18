import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Toy, ToyImage } from '../../models/toys';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Toy;
  @Input() showDetailsButton: boolean = true;
  @Input() showRequestButton: boolean = true;

  showRequestModal = false;
  isLoading = false;
  isLoadingImages = false;
  defaultImage = '/assets/images/default-product.png';
  toyImages: ToyImage[] = [];

  requestData = {
    name: '',
    email: '',
    message: '',
    dueDate: ''
  };

  currentImageIndex = 0;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadToyImages();
  }

  // Load images from database
  loadToyImages(): void {
    if (!this.product?.id) return;

    this.isLoadingImages = true;
    this.apiService.getToyImages(this.product.id).subscribe({
      next: (images) => {
        this.toyImages = images || [];
        this.currentImageIndex = 0; // Reset to first image
      },
      error: (error) => {
        console.error('Error loading toy images:', error);
        this.toyImages = [];
      },
      complete: () => {
        this.isLoadingImages = false;
      }
    });
  }

  // Get current image with fallback
  get currentImage(): string {
    if (!this.hasImages) return this.defaultImage;
        
    const image = this.toyImages[this.normalizedImageIndex];
    return image?.imageUrl || this.defaultImage;
  }

  get hasImages(): boolean {
    return !!this.toyImages?.length;
  }

  get normalizedImageIndex(): number {
    if (!this.hasImages) return 0;
    return (this.currentImageIndex + this.toyImages.length) % this.toyImages.length;
  }

  get imageCount(): number {
    return this.toyImages?.length || 0;
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    if (!this.hasImages) return;
    this.currentImageIndex = this.normalizedImageIndex - 1;
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    if (!this.hasImages) return;
    this.currentImageIndex = this.normalizedImageIndex + 1;
  }

  openRequestModal() {
    this.showRequestModal = true;
  }

  closeRequestModal() {
    this.showRequestModal = false;
  }


  submitRequest(): void {
    if (!this.validateRequest()) return;

    this.isLoading = true;
    const request = {
      toyId: this.product.id,
      toyName: this.product.name,
      ...this.requestData
    };

    this.apiService.addRequest(request).subscribe({
      next: () => {
        alert('Request sent successfully!');
        this.closeRequestModal();
      },
      error: (error) => {
        console.error('Error sending request:', error);
        alert(`Error: ${error.message || 'Failed to send request'}`);
      },
      complete: () => this.isLoading = false
    });
  }

  private validateRequest(): boolean {
    if (!this.requestData.name.trim()) {
      alert('Please enter your name');
      return false;
    }

    if (!this.requestData.email.includes('@')) {
      alert('Please enter a valid email');
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.requestData = {
      name: '',
      email: '',
      message: '',
      dueDate: ''
    };
  }

  openProductDetail(): void {
    if (!this.product) return;
        
    this.router.navigate(['/products', this.product.id], {
      state: { product: this.product }
    });
  }

  // Image error handling
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }

  // Refresh images (useful if images are updated elsewhere)
  refreshImages(): void {
    this.loadToyImages();
  }
}