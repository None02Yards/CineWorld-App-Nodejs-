import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { TvDetail } from '../models/tv-detail.model';
import { PaginatedResponse } from '../models/api-response.model';
import { CreditResponse } from '../models/credit.model';
import { VideoResponse } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class TvService {

  constructor(private dataService: DataService) {}

  getTvDetails(id: number): Observable<TvDetail> {
    return this.dataService.getDetails<TvDetail>('tv', id);
  }

  getSimilarTv(id: number): Observable<PaginatedResponse<TvDetail>> {
    return this.dataService.getSimilar<TvDetail>('tv', id);
  }

  getTvCredits(id: number): Observable<CreditResponse> {
    return this.dataService.getMediaCredits('tv', id);
  }

  getTvVideos(id: number): Observable<VideoResponse> {
    return this.dataService.getTrailer('tv', id);
  }
}
