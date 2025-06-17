import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ProductListComponent,
    CategoryFilterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  categories = ['Price', 'Color', 'Stock'];

  onCategorySelect(category: string) {
    console.log('Selected filter category:', category);
    // Later: show filter options here based on selected category
  }
}