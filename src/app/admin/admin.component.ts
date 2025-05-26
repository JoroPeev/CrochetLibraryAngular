import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProductListComponent } from '../admin/pages/product-card/admin-product-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminProductListComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isLoggedIn: boolean = false;

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token'); // simple check for token
  }
}
