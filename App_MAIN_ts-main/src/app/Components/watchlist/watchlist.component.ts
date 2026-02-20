

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { WatchlistService, WatchlistItem, CustomList } from 'src/app/Services/watchlist.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MovieDetail } from 'src/app/models/movie-detail.model';
import { TvDetail } from 'src/app/models/tv-detail.model';
import { KidsDataService } from 'src/app/Services/kids-data.service';



@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  childRouteActive = false;

  movies: WatchlistItem[] = [];
  tvShows: WatchlistItem[] = [];
  animes: WatchlistItem[] = [];

  customLists: string[] = [];
  newListName = '';
  newListDesc = '';
  newListPrivacy: 'public' | 'private' = 'public';
  isCreateListModalOpen = false;
  lastCreatedListId: string | null = null;

  constructor(
    private dataService: DataService,
    private watchlistService: WatchlistService,
     private kidsData: KidsDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.route.snapshot.firstChild?.routeConfig?.path;
        this.childRouteActive = !!currentRoute;
      }
    });

    const savedId = localStorage.getItem('lastCreatedListId');
    if (savedId) {
      this.lastCreatedListId = savedId;
    }

    const savedItems = this.watchlistService.getWatchlist();

    savedItems.forEach(item => {

      if (item.type === 'movie') {

        this.dataService
          .getDetails<MovieDetail>('movie', item.id)
          .subscribe(data => {

            const enriched: WatchlistItem = {
              id: item.id,
              type: 'movie',
              title: data.title,
              poster_path: data.poster_path ?? ''
            };

            this.movies.push(enriched);
          });

      } else if (item.type === 'tv') {

        this.dataService
          .getDetails<TvDetail>('tv', item.id)
          .subscribe(data => {

            const enriched: WatchlistItem = {
              id: item.id,
              type: 'tv',
              title: data.name,
              poster_path: data.poster_path ?? ''
            };

            this.tvShows.push(enriched);
          });

      } else if (item.type === 'anime') {

  this.dataService
    .getDetails<MovieDetail>('movie', item.id)
    .subscribe(data => {

      const enriched: WatchlistItem = {
        id: item.id,
        type: 'anime',
        title: data.title,
        poster_path: data.poster_path ?? ''
      };

      this.animes.push(enriched);
    });}
    });
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): void {

    this.watchlistService.removeFromWatchlist(id, type);

    if (type === 'movie') {
      this.movies = this.movies.filter(item => item.id !== id);
    }

    if (type === 'tv') {
      this.tvShows = this.tvShows.filter(item => item.id !== id);
    }

    if (type === 'anime') {
      this.animes = this.animes.filter(item => item.id !== id);
    }
  }

  openCreateListModal(): void {
    this.isCreateListModalOpen = true;
  }

// createCustomList(): void {

//   const newListId = Date.now().toString();

//   const newList: CustomList = {
//     id: newListId,
//     name: this.newListName,
//     description: this.newListDesc,
//     privacy: this.newListPrivacy,
//     items: [],
//     size: 'medium',
//     modifiedAt: new Date().toISOString()
//   };

//   this.watchlistService.saveCustomList(newList);

//   this.lastCreatedListId = newListId;
//   localStorage.setItem('lastCreatedListId', newListId);

//   this.resetListForm();

//   this.router.navigate(['/watchlist/custom', newListId]);

// }

createCustomList(): void {

  const newListId = Date.now().toString();

  const newList: CustomList = {
    id: newListId,
    name: this.newListName,
    description: this.newListDesc,
    privacy: this.newListPrivacy,
    items: [],
    size: 'medium',
    modifiedAt: new Date().toISOString()
  };

  this.watchlistService.saveCustomList(newList);

  this.lastCreatedListId = newListId;
  localStorage.setItem('lastCreatedListId', newListId);

  this.resetListForm();

  this.router.navigate(['/watchlist/custom', newListId]);
}


  cancelCreate(): void {
    this.resetListForm();
  }

  private resetListForm(): void {
    this.newListName = '';
    this.newListDesc = '';
    this.newListPrivacy = 'public';
    this.isCreateListModalOpen = false;
  }

goToCustomList(): void {
  if (this.lastCreatedListId) {
    this.router.navigate(['/watchlist/custom', this.lastCreatedListId]);
  } else {
    this.router.navigate(['/watchlist/custom']);
  }
}

// for more recent custom-list

// goToCustomRecentList(): void {

//   const savedId = localStorage.getItem('lastCreatedListId');

//   if (savedId) {
//     this.router.navigate(['/watchlist/custom', savedId]);
//   } else {
//     this.router.navigate(['/watchlist/custom']);
//   }
// }

}
