import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './Components/pages/profile/profile.component';
import { ManageProfilesComponent } from './Components/pages/profile/manage-profiles/manage-profiles.component';
import { ProfileGuard } from './guards/profile.guard';


import { HomeComponent } from './Components/home/home.component';
import { NotFoundPageComponent } from './Components/not-found-page/not-found-page.component';
import { AboutComponent } from './Components/about/about.component';
import { DetailsComponent } from './Components/details/details.component';
import { MoviesComponent } from './Components/movies/movies.component';
import { PeopleComponent } from './Components/people/people.component';
import { PersonDetailsComponent } from './Components/person-details/person-details.component';
import { SearchComponent } from './Components/search/search.component';
import { TVShowsComponent } from './Components/tvshows/tvshows.component';
import { WatchlistComponent } from './Components/watchlist/watchlist.component';
import { MoviesWatchlistComponent } from './Components/watchlist/movies-watchlist/movies-watchlist.component';
import { TvWatchlistComponent } from './Components/watchlist/tv-watchlist/tv-watchlist.component';
import { CreateListComponent } from './Components/watchlist/create-list/create-list.component';
import { CustomListDetailComponent } from './Components/watchlist/custom-list-detail/custom-list-detail.component';
import { KidsComponent } from './Components/kids/kids.component';
import { AnimeWatchlistComponent } from './Components/watchlist/anime-watchlist/anime-watchlist.component';



const routes: Routes = [

  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },

  { path: 'profile', component: ProfileComponent },
  { path: 'manage-profiles', component: ManageProfilesComponent },

  { path: 'home', component: HomeComponent, canActivate: [ProfileGuard] },
  { path: 'kids', component: KidsComponent, canActivate: [ProfileGuard] },

/* WATCHLIST */
{ path: 'watchlist', component: WatchlistComponent, canActivate: [ProfileGuard] },
{ path: 'watchlist/movies', component: MoviesWatchlistComponent, canActivate: [ProfileGuard] },
{ path: 'watchlist/tv', component: TvWatchlistComponent, canActivate: [ProfileGuard] },
{ path: 'watchlist/animes', component: AnimeWatchlistComponent, canActivate: [ProfileGuard] },

{ path: 'watchlist/custom', component: CustomListDetailComponent, canActivate: [ProfileGuard] },
{ path: 'watchlist/custom/:id', component: CustomListDetailComponent, canActivate: [ProfileGuard] },
// { path: 'list/:id', component: CustomListDetailComponent },
// { path: 'watchlist/create', component: CreateListComponent, canActivate: [ProfileGuard] },
{ path: 'create-list', component: CreateListComponent, canActivate: [ProfileGuard] },

/* MEDIA */
  { path: 'movies/:genre/:page', component: MoviesComponent },
  { path: 'tvshows/:genre/:page', component: TVShowsComponent },
  { path: 'details/:mediaType/:id', component: DetailsComponent },
  { path: 'person/:id', component: PersonDetailsComponent },
  { path: 'people/:page', component: PeopleComponent },

  /* SEARCH */
  { path: 'search', component: SearchComponent },
  { path: 'search/:target', component: SearchComponent },

  { path: 'about', component: AboutComponent },

  { path: '**', component: NotFoundPageComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}