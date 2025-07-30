import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Toy } from '../../models/toys';

interface RouterState {
  product?: Toy;
}

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule],
  template: `...`, // Same as provided
  styles: [`...`]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId: string = '';
  currentUrl: string = '';
  loading: boolean = false;
  error: string | null = null;
  routerState: RouterState = {};
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    console.log('🏗️ ProductDetailComponent constructor called');
    console.log('🔗 Router URL:', this.router.url);
    console.log('📦 History state:', history.state);
  }

  ngOnInit() {
  console.log('🚀 ProductDetailComponent ngOnInit started');
  this.currentUrl = this.router.url;
  this.routerState = history.state;

  this.subscription.add(
    this.route.paramMap.subscribe(params => {
      console.log('📋 Route params received:', params);
      this.productId = params.get('id') || '';
      console.log('🆔 Product ID:', this.productId);

      if (!this.productId) {
        this.error = 'No product ID provided';
        console.error('❌ No product ID found in route');
        this.loading = false;
      } else if (!this.routerState?.product) {
        this.loading = true;
        this.apiService.getToys().subscribe({
          next: (toys: Toy[]) => {
            const product = toys.find(toy => toy.id === this.productId);
            if (product) {
              this.routerState = { product };
            } else {
              this.error = 'Product not found';
              console.error('❌ Product not found for ID:', this.productId);
            }
            this.loading = false;
          },
          error: (err: Error) => {
            this.error = err.message || 'Failed to load product details';
            this.loading = false;
            console.error('❌ Error fetching toys:', err);
          }
        });
      } else {
        console.log('✅ Product ID found:', this.productId);
        this.loading = false;
      }
    })
  );
}

  goBack() {
    console.log('🔙 Navigating back to shop');
    this.router.navigate(['/shop']);
  }

  retry() {
    this.error = null;
    this.ngOnInit();
  }

  ngOnDestroy() {
    console.log('🧹 ProductDetailComponent destroyed');
    this.subscription.unsubscribe();
  }
}