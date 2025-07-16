// product-detail.component.ts - Standalone version
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule],
  template: `
    <div class="product-detail-container">
      <!-- Debug info -->
      <div class="debug-info" style="background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3>🔍 Debug Information</h3>
        <p><strong>Component Status:</strong> ✅ LOADED SUCCESSFULLY</p>
        <p><strong>Current URL:</strong> {{ currentUrl }}</p>
        <p><strong>Product ID:</strong> {{ productId || 'Not found' }}</p>
        <p><strong>Loading:</strong> {{ loading }}</p>
        <p><strong>Error:</strong> {{ error || 'None' }}</p>
        <p><strong>Router State:</strong> {{ routerState | json }}</p>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading" class="loading-state">
        <h2>Loading product details...</h2>
        <div class="spinner">🔄</div>
      </div>

      <!-- Error state -->
      <div *ngIf="error && !loading" class="error-state" style="background: #ffebee; padding: 15px; border-radius: 8px; border-left: 4px solid #f44336;">
        <h2>❌ Error</h2>
        <p>{{ error }}</p>
      </div>

      <!-- Success state -->
      <div *ngIf="!loading && !error" class="success-state" style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
        <h1>✅ Product Detail Page</h1>
        <h2>Product ID: {{ productId }}</h2>
        <p>This page should show details for product: <strong>{{ productId }}</strong></p>
        
        <!-- Router state info -->
        <div *ngIf="routerState?.product" style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <h3>Product from Router State:</h3>
          <p><strong>Name:</strong> {{ routerState.product.name }}</p>
          <p><strong>Price:</strong> {{ routerState.product.price }} лв</p>
          <p><strong>Description:</strong> {{ routerState.product.description }}</p>
        </div>
      </div>

      <!-- Back button -->
      <button 
        (click)="goBack()" 
        style="
          margin-top: 20px; 
          padding: 12px 24px; 
          background: #2196f3; 
          color: white; 
          border: none; 
          border-radius: 6px; 
          cursor: pointer;
          font-size: 16px;
        "
      >
        ← Back to Shop
      </button>
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .spinner {
      font-size: 24px;
      animation: spin 2s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    button:hover {
      background: #1976d2 !important;
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId: string = '';
  currentUrl: string = '';
  loading: boolean = false;
  error: string | null = null;
  routerState: any = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router
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
        } else {
          console.log('✅ Product ID found:', this.productId);
        }
      })
    );
  }

  goBack() {
    console.log('🔙 Navigating back to shop');
    this.router.navigate(['/shop']);
  }

  ngOnDestroy() {
    console.log('🧹 ProductDetailComponent destroyed');
    this.subscription.unsubscribe();
  }
}