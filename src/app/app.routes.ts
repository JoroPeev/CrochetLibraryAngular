import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
];
