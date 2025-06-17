import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Add this!

@Component({
  selector: 'app-category-filter',
  standalone: true, // 👈 if it’s standalone (which it should be for your setup)
  imports: [CommonModule], // 👈 Add this!
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css']
})
export class CategoryFilterComponent {
  @Input() categories: string[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  activeCategory: string = 'All';

  selectCategory(category: string) {
    this.activeCategory = category;
    this.categorySelected.emit(category);
  }
}
