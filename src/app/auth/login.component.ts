import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,                     
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule] 
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private apiService: ApiService) {}

  login() {
    this.apiService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.message = 'Login successful!';
          console.log('Token:', res.token);
        },
        error: () => {
          this.message = 'Login failed.';
        }
      });
  }
}
