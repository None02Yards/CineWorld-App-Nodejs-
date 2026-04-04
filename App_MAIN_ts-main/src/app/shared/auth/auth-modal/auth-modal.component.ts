import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})

export class AuthModalComponent {

  mode: 'login' | 'signup' = 'login';

  @Output() close = new EventEmitter();
  @Output() loginSuccess = new EventEmitter();

  switchToSignup() {
    this.mode = 'signup';
  }

  switchToLogin() {
    this.mode = 'login';
  }

  onLoginSuccess() {
    this.loginSuccess.emit();
  }

  closeModal() {
    this.close.emit();
  }

}
