import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../product-list/product-list.component'; // adjust path if needed

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
