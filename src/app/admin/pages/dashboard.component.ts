import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  template: `
    <h1>Welcome to the Admin Dashboard</h1>
    <p>Use the sidebar to manage your products.</p>
  `
})
export class DashboardComponent {}
