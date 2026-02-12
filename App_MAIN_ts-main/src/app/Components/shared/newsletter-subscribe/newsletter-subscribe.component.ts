import { Component } from '@angular/core';
import { NewsletterService } from 'src/app/Services/newsletter.service';

@Component({
  selector: 'app-newsletter-subscribe',
  templateUrl: './newsletter-subscribe.component.html',
  styleUrls: ['./newsletter-subscribe.component.scss']
})
export class NewsletterSubscribeComponent {

  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private newsletter: NewsletterService) {}

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email) {
      this.errorMessage = 'Email is required';
      return;
    }

    this.loading = true;

    this.newsletter.subscribe(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Check your email to confirm your subscription.';
        this.email = '';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Subscription failed';
      }
    });
  }
}
