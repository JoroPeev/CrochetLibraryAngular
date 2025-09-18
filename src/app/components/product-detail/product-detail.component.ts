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
  errorMessage: string | null = null;
  defaultImage = '/assets/images/default-product.png';

  showReviewForm = false;
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

  newReview: Review = {
    name: '',
    emailAddress: '',
    comment: '',
    customerRating: 0,
    toyId: ''
  };

  hoverRating = 0;

  setRating(star: number): void {
    this.newReview.customerRating = star;
  }

  Math = Math; // Expose Math for template
  Number = Number; // Expose Number for template

  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.errorMessage = 'No product ID provided';
      this.router.navigate(['/']);
    }
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.apiService.getToyById(id).subscribe({
      next: (toy) => {
        this.product = toy;
        this.toyImages = toy.images || [];
        this.loadReviews();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load product. Please try again later.';
        console.error('Error fetching product:', err);
        this.router.navigate(['/']);
      },
      complete: () => (this.isLoading = false)
    });
  }

  loadReviews(): void {
    if (!this.product?.id) return;
    this.apiService.getReviews(this.product.id.toString()).subscribe({
      next: (reviews: Review[]) => {
        if (this.product) {
          this.product.reviews = reviews;
          console.log('✅ Processed reviews:', this.product.reviews);
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reviews.';
        console.error('Error loading reviews:', err);
      }
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview(): void {
    if (!this.validateReview() || !this.product?.id) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const reviewDto: Review = {
      name: this.newReview.name.trim(),
      emailAddress: this.newReview.emailAddress.trim(),
      comment: this.newReview.comment.trim(),
      customerRating: this.newReview.customerRating,
      toyId: this.product.id
    };

    this.apiService.addReview(this.product.id.toString(), reviewDto).subscribe({
      next: () => {
        if (this.product) {
          this.product.reviews = this.product.reviews ?? [];
          this.product.reviews.unshift(reviewDto); // Use reviewDto instead of savedReview
        }
        this.newReview = {
          name: '',
          emailAddress: '',
          comment: '',
          customerRating: 0,
          toyId: this.product?.id ?? ''
        };
        this.hoverRating = 0;
        this.showReviewForm = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit review. Please try again.';
        console.error('Error adding review:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validateReview(): boolean {
    if (!this.newReview.name.trim()) {
      this.errorMessage = 'Please enter your name.';
      return false;
    }
    if (!this.isValidEmail(this.newReview.emailAddress)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }
    if (!this.newReview.comment.trim()) {
      this.errorMessage = 'Please enter a comment.';
      return false;
    }
    if (this.newReview.customerRating < 1 || this.newReview.customerRating > 5) {
      this.errorMessage = 'Please select a rating (1–5 stars).';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  get averageRating(): number {
    if (!this.product?.reviews || this.product.reviews.length === 0) {
      return 0;
    }
    const sum = this.product.reviews.reduce((acc, r) => acc + r.customerRating, 0);
    return sum / this.product.reviews.length;
  }

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

  openRequestModal(): void {
    this.showRequestModal = true;
    this.showThankYou = false;
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
    this.showThankYou = false;
    this.resetForm();
  }

  submitRequest(): void {
    if (!this.validateRequest() || !this.product) {
      this.errorMessage = 'Please fill in all required fields with valid data.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const dueDate = this.requestData.dueDate
      ? new Date(this.requestData.dueDate)
      : null;

    if (dueDate && isNaN(dueDate.getTime())) {
      this.errorMessage = 'Invalid due date format.';
      this.isLoading = false;
      return;
    }

    const request = {
      toyId: this.product.id,
      toyName: this.product.name,
      name: this.requestData.name.trim(),
      email: this.requestData.email.trim(),
      message: this.requestData.message.trim(),
      dueDate,
      SubscribeToNewsletter: this.requestData.newsletter
    };

    this.apiService.addRequest(request).subscribe({
      next: () => {
        this.showThankYou = true;
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message || 'Failed to send request'}`;
        console.error('Error sending request:', err);
      },
      complete: () => (this.isLoading = false)
    });
  }

  private validateRequest(): boolean {
    if (!this.requestData.name.trim()) {
      this.errorMessage = 'Please enter your name.';
      return false;
    }
    if (!this.isValidEmail(this.requestData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }
    if (!this.requestData.dueDate) {
      this.errorMessage = 'Please select a due date.';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  resetForm(): void {
    this.requestData = {
      name: '',
      email: '',
      message: '',
      dueDate: '',
      newsletter: false
    };
    this.errorMessage = null;
  }
}