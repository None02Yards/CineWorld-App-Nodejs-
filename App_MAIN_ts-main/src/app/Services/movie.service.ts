import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataService } from './data.service';
import { MovieDetail } from '../models/movie-detail.model';
import { PaginatedResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { CreditResponse } from '../models/credit.model';
import { VideoResponse } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = environment.MovieAPI;
  private apiKey = environment.APIKey;

  constructor(private dataService: DataService) {}

  getMovieDetails(id: number): Observable<MovieDetail> {
    return this.dataService.getDetails<MovieDetail>('movie', id);
  }

  getSimilarMovies(id: number): Observable<PaginatedResponse<MovieDetail>> {
    return this.dataService.getSimilar<MovieDetail>('movie', id);
  }

  getMovieCredits(id: number): Observable<CreditResponse> {
    return this.dataService.getMediaCredits('movie', id);
  }

  getMovieVideos(id: number): Observable<VideoResponse> {
    return this.dataService.getTrailer('movie', id);
  }

async getYoutubeTrailerKey(
  id: number,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<string | null> {

  try {
    const res = mediaType === 'movie'
      ? await this.getMovieVideos(id).toPromise()
      : await this.dataService.getTrailer(mediaType, id).toPromise();

    const video = res?.results?.find(
      v => v.site === 'YouTube' && v.type === 'Trailer'
    );

    return video ? video.key : null;

  } catch {
    return null;
  }
}


}
