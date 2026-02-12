// import { Injectable } from '@angular/core';
// import { Observable, of, throwError } from 'rxjs';
// import { delay } from 'rxjs/operators';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class NewsletterService {

// //   /**
// //    * TEMPORARY mock implementation.
// //    * Replace with real HTTP call later.
// //    */
// //   subscribe(email: string): Observable<{ success: boolean }> {
// //     if (!this.isValidEmail(email)) {
// //       return throwError(() => new Error('Invalid email address'));
// //     }

// //     // simulate API delay
// //     return of({ success: true }).pipe(delay(800));
// //   }

// //   private isValidEmail(email: string): boolean {
// //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// //   }
// // }


// @Injectable({
//   providedIn: 'root'
// })
// export class NewsletterService {

//   private storageKey = 'newsletterSubscribers';

//   subscribe(email: string): { success: boolean; message: string } {
//     const subscribers = this.getSubscribers();

//     if (subscribers.includes(email)) {
//       return { success: false, message: 'Email already subscribed.' };
//     }

//     subscribers.push(email);
//     localStorage.setItem(this.storageKey, JSON.stringify(subscribers));

//     return { success: true, message: 'Subscribed successfully.' };
//   }

//   private getSubscribers(): string[] {
//     const data = localStorage.getItem(this.storageKey);
//     return data ? JSON.parse(data) : [];
//   }
// }

// import { HttpClient } from '@angular/common/http';

// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class NewsletterService {

//   private storageKey = 'newsletterEmails';

//   subscribe(email: string): Observable<{ success: boolean; message: string }> {
//     const emails = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

//     if (emails.includes(email)) {
//       return of({ success: false, message: 'Email already subscribed.' });
//     }

//     emails.push(email);
//     localStorage.setItem(this.storageKey, JSON.stringify(emails));

//     return of({ success: true, message: 'Subscription successful!' });
//   }
// }


// src/app/Services/newsletter.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private apiUrl = 'http://localhost:5000/api/newsletter';

  constructor(private http: HttpClient) {}

  subscribe(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribe`, { email });
  }
}
