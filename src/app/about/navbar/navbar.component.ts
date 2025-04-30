import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null; // <-- declare it here

  constructor(private router: Router) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email'); // <-- fetch email on init
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
