import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();

  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    const loginData = { email: this.email, password: this.password };
    this.authService.login(loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        alert('Login successful!');
        this.close.emit();
      },
      error: () => alert('Invalid login.')
    });
  }
}
