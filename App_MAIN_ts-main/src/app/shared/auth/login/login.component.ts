import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  @Output() signupRequested = new EventEmitter();
  @Output() loginSuccess = new EventEmitter();

  constructor(private authService: AuthService) {}

  login() {

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password)
      .subscribe({

        next: (res: any) => {

          localStorage.setItem('token', res.token);

          this.loginSuccess.emit();

        },

        error: (err) => {

          this.errorMessage = err.error?.message || 'Login failed';
          this.loading = false;

        }

      });

  }

  goToSignup() {
    this.signupRequested.emit();
  }

}