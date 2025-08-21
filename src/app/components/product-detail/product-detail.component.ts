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

  // expose Math/Number for template
  Math = Math;
  Number = Number;

  newReview: Review = {
    name: '',
    emailAddress: '',
    comment: '',
    reviewDate: new Date().toISOString(),
    rating: 0 // default no stars
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
}
