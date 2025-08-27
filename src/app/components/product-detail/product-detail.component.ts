import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Toy, ToyImage, Review } from '../../models/toys';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Toy;
  toyImages: ToyImage[] = [];
  isLoading = false;
  defaultImage = '/assets/images/default-product.png';

  showReviewForm = false;

  // --- Request Modal ---
  showRequestButton = true;
  showRequestModal = false;
  showThankYou = false;

  requestData = {
    name: '',
    email: '',
    message: '',
    dueDate: '',
    newsletter: false
  };

  // expose Math/Number for template
  Math = Math;
  Number = Number;

  newReview: Review = {
    name: '',
    emailAddress: '',
    comment: '',
    reviewDate: new Date().toISOString(),
    rating: 0
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const navState = history.state?.product as Toy;
    if (navState?.id) {
      this.product = navState;
      this.toyImages = navState.images || [];
      this.loadReviews();
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        console.error('No product ID found in route');
        this.router.navigate(['/']);
      }
    }
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.apiService.getToyById(id).subscribe({
      next: (toy) => {
        this.product = toy;
        this.toyImages = toy.images || [];
        this.loadReviews();
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.router.navigate(['/']);
      },
      complete: () => (this.isLoading = false)
    });
  }

  loadReviews(): void {
    if (!this.product?.id) return;
    this.apiService.getReviews(this.product.id.toString()).subscribe({
      next: (reviews) => {
        if (this.product) this.product.reviews = reviews;
      },
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview(): void {
    if (!this.newReview.name || !this.newReview.comment || !this.newReview.emailAddress) {
      alert('Please fill in all fields');
      return;
    }

    if (!this.product?.id) return;

    const reviewDto: Review = {
      name: this.newReview.name,
      emailAddress: this.newReview.emailAddress,
      comment: this.newReview.comment,
      reviewDate: new Date().toISOString(),
      rating: this.newReview.rating
    };

    this.apiService.addReview(this.product.id.toString(), reviewDto).subscribe({
      next: () => {
        this.loadReviews();
        this.newReview = {
          name: '',
          emailAddress: '',
          comment: '',
          reviewDate: new Date().toISOString(),
          rating: 0
        };
        this.showReviewForm = false;
      },
      error: (err) => console.error('Error adding review:', err)
    });
  }

  // --- Image slideshow ---
  currentImageIndex = 0;

  get currentImage(): string {
    return this.toyImages.length > 0
      ? this.toyImages[this.currentImageIndex]?.imageUrl || this.defaultImage
      : this.defaultImage;
  }

  nextImage(): void {
    if (this.toyImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.toyImages.length;
    }
  }

  prevImage(): void {
    if (this.toyImages.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.toyImages.length) % this.toyImages.length;
    }
  }

  // --- Request Modal logic (copied from ProductCardComponent) ---
  openRequestModal() {
    this.showRequestModal = true;
    this.showThankYou = false;
  }

  closeRequestModal() {
    this.showRequestModal = false;
    this.showThankYou = false;
    this.resetForm();
  }

  submitRequest(): void {
    if (!this.validateRequest() || !this.product) return;

    this.isLoading = true;

    const request = {
      toyId: this.product.id,
      toyName: this.product.name,
      name: this.requestData.name,
      email: this.requestData.email,
      message: this.requestData.message,
      dueDate: this.requestData.dueDate ? new Date(this.requestData.dueDate) : null,
      SubscribeToNewsletter: this.requestData.newsletter
    };

    this.apiService.addRequest(request).subscribe({
      next: () => {
        this.showThankYou = true;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error sending request:', error);
        alert(`Error: ${error.message || 'Failed to send request'}`);
      },
      complete: () => (this.isLoading = false)
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

    if (!this.requestData.dueDate) {
      alert('Please select a due date');
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.requestData = {
      name: '',
      email: '',
      message: '',
      dueDate: '',
      newsletter: false
    };
  }
}
