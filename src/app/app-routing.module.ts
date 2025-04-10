import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  // Add more routes here
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // optional
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
