import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

private baseUrl = environment.MovieAPI;
private apiKey = environment.APIKey;

  constructor(private http: HttpClient) {}

  getPersonDetails(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/person/${id}?api_key=${this.apiKey}`
    );
  }

  getPersonCredits(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/person/${id}/movie_credits?api_key=${this.apiKey}`
    );
  }

  getCombinedCredits(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/person/${id}/combined_credits?api_key=${this.apiKey}`
    );
  }

  getPopularPeople(page: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/person/popular?api_key=${this.apiKey}&page=${page}`
    );
  }
}
