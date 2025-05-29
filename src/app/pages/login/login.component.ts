import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const loginData = { email: this.email, password: this.password };
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.setLoggedIn(response.token);
        alert('Login successful!');
        this.loginSuccess.emit();
        this.close.emit();
        this.router.navigate(['/admin']);
      },
      error: () => alert('Invalid login.')
    });
  }
}