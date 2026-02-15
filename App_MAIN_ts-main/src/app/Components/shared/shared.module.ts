// src\app\Components\shared\shared.module.ts

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WatchlistCardComponent } from './watchlist-card/watchlist-card.component';
import { RatingCircleComponent } from '../../shared/rating-circle/rating-circle.component'; // 👈 Import it
import { FreeToWatchComponent } from '../free-to-watch/free-to-watch.component';
import { LatestTrailersComponent } from '../latest-trailers/latest-trailers.component'; // ✅ Import it
import { WatchlistActionComponent } from '../watchlist-action/watchlist-action.component';
import {CelebritiesComponent} from '../celebrities/celebrities.component';
import { NewsletterSubscribeComponent } from '../shared/newsletter-subscribe/newsletter-subscribe.component';
import { HoverPreviewComponent } from './hover-preview/hover-preview.component';




@NgModule({
  declarations: [
    WatchlistCardComponent,
    RatingCircleComponent,
    FreeToWatchComponent,
      LatestTrailersComponent,
      WatchlistActionComponent,
CelebritiesComponent,
    NewsletterSubscribeComponent,
    HoverPreviewComponent,
   


],
  exports: [
    WatchlistCardComponent,
    RatingCircleComponent,
    FreeToWatchComponent,
    LatestTrailersComponent,
    WatchlistActionComponent,
    CelebritiesComponent,
        NewsletterSubscribeComponent,
    HoverPreviewComponent,

  ],
imports: [
    CommonModule,
    RouterModule,
     FormsModule,
                   
  ],})

export class SharedModule {}
