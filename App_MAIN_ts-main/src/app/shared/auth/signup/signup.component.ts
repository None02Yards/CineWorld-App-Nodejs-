import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  signup() {

    this.authService.signup(this.email, this.password)
      .subscribe((res: any) => {

        localStorage.setItem("token", res.token);

      });

  }
goToLogin() {
  console.log("switch to login");
}
}