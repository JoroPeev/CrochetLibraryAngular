import { HttpClientModule } from '@angular/common/http'; // <-- Import this
import { ApiService } from './services/api.service'; // <-- Make sure ApiService is imported
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './about/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    CommonModule,
    HttpClientModule 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  featuredToys: any;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getToys().subscribe({
      next: (res) => {
        console.log('Backend response:', res);
        this.featuredToys = res;
      },
      error: (err) => console.error('API Error:', err)
    });
  }
}
