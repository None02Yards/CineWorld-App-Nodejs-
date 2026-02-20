


import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DataService } from 'src/app/Services/data.service';
import { KidsDataService } from 'src/app/Services/kids-data.service';

type TrailerCategory =
  | 'popular'
  | 'streaming'
  | 'on_tv'
  | 'for_rent'
  | 'in_theaters';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
}

@Component({
  selector: 'app-latest-trailers',
  templateUrl: './latest-trailers.component.html',
  styleUrls: ['./latest-trailers.component.scss']
})
export class LatestTrailersComponent implements OnInit {

  @Input() isKids = false;

  trailerTabs: { label: string; key: TrailerCategory }[] = [
    { label: 'Popular', key: 'popular' },
    { label: 'Streaming', key: 'streaming' },
    { label: 'On TV', key: 'on_tv' },
    { label: 'For Rent', key: 'for_rent' },
    { label: 'In Theaters', key: 'in_theaters' }
  ];

  selectedTab: TrailerCategory = 'popular';
  latestTrailers: any[] = [];

  constructor(
    private dataService: DataService,
    private kidsData: KidsDataService
  ) {}

  ngOnInit(): void {
    this.fetchLatestTrailers(this.selectedTab);
  }

  async fetchLatestTrailers(tabKey: TrailerCategory) {
    this.selectedTab = tabKey;
    const trailerList: any[] = [];

    try {

      /* =================== KIDS MODE =================== */
      if (this.isKids) {

        const data = await firstValueFrom(
          this.kidsData.getKidsMovies()
        );

        const shuffled = this.shuffleArray(
          (data?.results ?? []) as MediaItem[]
        ).slice(0, 10);

        for (const item of shuffled) {

          const trailers = await firstValueFrom(
            this.kidsData.getKidsVideos(item.id)
          );

          const key = trailers?.results?.find(
            (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
          )?.key;

          if (key) {
            trailerList.push({
              title: item.title || item.name,
              thumbnail: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
              videoUrl: `https://www.youtube.com/watch?v=${key}`
            });
          }

          if (trailerList.length >= 4) break;
        }

      }

      /* =================== IN THEATERS (SPECIAL CASE) =================== */
      else if (tabKey === 'in_theaters') {

        const [moviesResult, showsResult] = await Promise.all([
          firstValueFrom(
            this.dataService.getTrailerCategory<MediaItem>('in_theaters')
          ),
          firstValueFrom(
            this.dataService.getData<MediaItem>('tv', 'airing_today', 1)
          )
        ]);

        const combined: MediaItem[] = [
          ...(moviesResult?.results ?? []),
          ...(showsResult?.results ?? [])
        ];

        const shuffled = this.shuffleArray(combined).slice(0, 10);

        for (const item of shuffled) {

          const isTV = !!item.name && !item.title;

          const trailerKey = await this.dataService.getYoutubeTrailerKey(
            item.id,
            isTV ? 'tv' : 'movie'
          );

          if (trailerKey) {
            trailerList.push({
              title: item.title || item.name,
              thumbnail: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
              videoUrl: `https://www.youtube.com/watch?v=${trailerKey}`
            });
          }

          if (trailerList.length >= 4) break;
        }
      }

      /* =================== ALL OTHER CATEGORIES =================== */
      else {

        const isTV = tabKey === 'on_tv';

        const data = await firstValueFrom(
          this.dataService.getTrailerCategory<MediaItem>(tabKey)
        );

        const shuffled = this.shuffleArray(
          (data?.results ?? [])
        ).slice(0, 10);

        for (const item of shuffled) {

          const trailerKey = await this.dataService.getYoutubeTrailerKey(
            item.id,
            isTV ? 'tv' : 'movie'
          );

          if (trailerKey) {
            trailerList.push({
              title: item.title || item.name,
              thumbnail: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
              videoUrl: `https://www.youtube.com/watch?v=${trailerKey}`
            });
          }

          if (trailerList.length >= 4) break;
        }
      }

      this.latestTrailers = trailerList;

    } catch (err) {
      console.error('Latest trailers error:', err);
      this.latestTrailers = [];
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}
