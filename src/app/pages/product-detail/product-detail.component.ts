import { Component, OnInit } from '@angular/core';
import { Toy } from '../../models/toys';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [CommonModule]
})
export class ProductDetailComponent {
  toy?: Toy;
}

