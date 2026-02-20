
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResponse } from '../models/api-response.model';
import { VideoResponse } from '../models/video.model';
import { CreditResponse } from '../models/credit.model';
import { NewsResponse } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly baseUrl = environment.MovieAPI;
  private readonly apiKey = environment.APIKey;

  readonly MovieAPI = environment.MovieAPI;
readonly APIKey = environment.APIKey;


  constructor(private http: HttpClient) {}

  /* ------------------------- Utility ------------------------- */

  private buildUrl(path: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.baseUrl}/${path}`);
    url.searchParams.set('api_key', this.apiKey);

    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.set(key, String(value))
      );
    }

    return url.toString();
  }

  // private handleError(error: HttpErrorResponse) {
  //   return throwError(() => new Error('Something went wrong. Try again later.'));
  // }


  
  /* ------------------------- Generic Media ------------------------- */

  getTrending<T>(mediaType: 'movie' | 'tv' | 'all'): 
  Observable<PaginatedResponse<T>> {
    return this.http
      .get<PaginatedResponse<T>>(this.buildUrl(`trending/${mediaType}/day`))
      .pipe(catchError(this.handleError));
  }

  getData<T>(
    mediaType: 'movie' | 'tv',
    category: string,
    page: number
  ): Observable<PaginatedResponse<T>> {
    return this.http
      .get<PaginatedResponse<T>>(
        this.buildUrl(`${mediaType}/${category}`, { page })
      )
      .pipe(catchError(this.handleError));
  }

  getSimilar<T>(
    mediaType: 'movie' | 'tv',
    id: number
  ): Observable<PaginatedResponse<T>> {
    return this.http
      .get<PaginatedResponse<T>>(
        this.buildUrl(`${mediaType}/${id}/similar`)
      )
      .pipe(catchError(this.handleError));
  }

  getDetails<T>(
    mediaType: 'movie' | 'tv',
    id: number
  ): Observable<T> {
    return this.http
      .get<T>(this.buildUrl(`${mediaType}/${id}`))
      .pipe(catchError(this.handleError));
  }

  getTrailer(
    mediaType: 'movie' | 'tv',
    id: number
  ): Observable<VideoResponse> {
    return this.http
      .get<VideoResponse>(this.buildUrl(`${mediaType}/${id}/videos`))
      .pipe(catchError(this.handleError));
  }

  getMediaCredits(
    mediaType: 'movie' | 'tv',
    id: number
  ): Observable<CreditResponse> {
    return this.http
      .get<CreditResponse>(this.buildUrl(`${mediaType}/${id}/credits`))
      .pipe(catchError(this.handleError));
  }

  /* ------------------------- Search ------------------------- */

  searchMulti<T>(query: string): Observable<PaginatedResponse<T>> {
    return this.http
      .get<PaginatedResponse<T>>(
        this.buildUrl(`search/multi`, { query })
      )
      .pipe(catchError(this.handleError));
  }

  searchByType(query: string, type: string): Observable<any> {
  return this.http.get(
    `${this.MovieAPI}/search/${type}?api_key=${this.APIKey}&query=${query}`
  );
}

search(query: string): Observable<any> {
  return this.http.get(
    `${this.MovieAPI}/search/multi?api_key=${this.APIKey}&query=${query}`
  );
}

getPeople(page: number = 1): Observable<{
  page: number;
  results: any[];
  total_pages: number;
}> {
  return this.http.get<{
    page: number;
    results: any[];
    total_pages: number;
  }>(
    `${this.MovieAPI}/person/popular?api_key=${this.APIKey}&language=en-US&page=${page}`
  );
}


getMovieGenres(): Observable<any> {
  return this.http.get(
    `${this.MovieAPI}/genre/movie/list?api_key=${this.APIKey}`
  );
}


getGenres(type: 'movie' | 'tv'): Observable<any> {
  return this.http.get(
    `${this.MovieAPI}/genre/${type}/list?api_key=${this.APIKey}`
  );
}

getNowPlaying(page: number): Observable<any> {
  return this.http.get(
    `${this.MovieAPI}/movie/now_playing?api_key=${this.APIKey}&page=${page}`
  );
}
getCredits(id: number): Observable<any> {
  return this.http.get(
    `${this.MovieAPI}/person/${id}/movie_credits?api_key=${this.APIKey}`
  );
}

 

getSearch<T = any>(
  query: string,
  type: 'movie' | 'tv' | 'person' | 'multi' = 'multi'
): Observable<{
  page: number;
  results: T[];
  total_pages: number;
}> {
  return this.http.get<{
    page: number;
    results: T[];
    total_pages: number;
  }>(
    `${this.MovieAPI}/search/${type}?api_key=${this.APIKey}&query=${query}`
  );
}


  getPersonDetails(id: number): Observable<any> {
    return this.http.get(this.buildUrl(`person/${id}`));
  }

  getCombinedCredits(id: number): Observable<any> {
    return this.http.get(this.buildUrl(`person/${id}/combined_credits`));
  }

  /* ------------------------- YouTube Trailer ------------------------- */



  /* ------------------------- News ------------------------- */

getEntertainmentNews(): Observable<NewsResponse> {
  return this.http.get<NewsResponse>(
    'YOUR_NEWS_API_URL'
  );
}


/* ------------------------- Error Handling ------------------------- */

private handleError(error: HttpErrorResponse) {
  console.error('API Error:', error);
  return throwError(() => new Error('Something went wrong.'));
}

fetchFromApi<T>(url: string): Observable<T> {
  return this.http.get<T>(url).pipe(
    catchError(this.handleError)
  );
}


getFreeToWatch<T>(
  type: 'movie' | 'tv'
): Observable<PaginatedResponse<T>> {

  const randomPage = Math.floor(Math.random() * 5) + 1;

  return this.http.get<PaginatedResponse<T>>(
    this.buildUrl(`discover/${type}`, {
      with_watch_monetization_types: 'free',
      sort_by: 'popularity.desc',
      page: randomPage
    })
  ).pipe(catchError(this.handleError));
}


getTrailerCategory<T>(
  category: 'popular' | 'streaming' | 'on_tv' | 'for_rent' | 'in_theaters'
): Observable<PaginatedResponse<T>> {

  let path = '';
  let params: Record<string, string | number> = {};

  switch (category) {
    case 'popular':
      path = 'movie/popular';
      break;

    case 'streaming':
      path = 'movie/upcoming';
      break;

    case 'on_tv':
      path = 'discover/tv';
      params = {
        with_watch_monetization_types: 'flatrate',
        sort_by: 'popularity.desc',
        page: Math.floor(Math.random() * 5) + 1
      };
      break;

    case 'for_rent':
      path = 'discover/movie';
      params = {
        with_watch_monetization_types: 'rent'
      };
      break;

    case 'in_theaters':
      path = 'movie/now_playing';
      break;
  }

  return this.http.get<PaginatedResponse<T>>(
    this.buildUrl(path, params)
  ).pipe(catchError(this.handleError));
}



async getYoutubeTrailerKey(
  id: number,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<string | null> {

  try {
    const res = await firstValueFrom(
      this.getTrailer(mediaType, id)
    );

    const video = res.results?.find(
      (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
    );

    return video ? video.key : null;

  } catch (error) {
    console.error('Trailer fetch error:', error);
    return null;
  }
}


}
