import { Routes } from '@angular/router';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';

import { AuthGuard } from './services/auth.guard'

export const routes: Routes = [
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/pages/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'admin/products',
        loadComponent: () => import('./admin/pages/product-card/admin-product-list.component')
          .then(m => m.AdminProductListComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./admin/pages/product-edit.component').then(m => m.ProductEditComponent)
      }
    ]
  }
];
