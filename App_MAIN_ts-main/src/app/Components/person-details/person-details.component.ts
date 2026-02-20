

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PeopleService } from 'src/app/Services/people.service';
import { MovieService } from 'src/app/Services/movie.service';
import { filter } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type MT = 'movie' | 'tv';

interface TrailerClip {
  id: number;
  mediaType: MT;
  title: string;
  poster: string | null;
  key: string;
  url: SafeResourceUrl;
  urlAuto: SafeResourceUrl;
  playing?: boolean;
}

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {

  personData: any = {};
  knownFor: any[] = [];
  moreToExploreCelebs: any[] = [];
  profileSrc = '';
  showFullBio = false;
  personId!: number;
  roles: string[] = [];

  trailers: TrailerClip[] = [];
  loadingTrailers = false;

  constructor(
    private peopleService: PeopleService,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadPerson());

    this.loadPerson();
    this.getMoreToExploreCelebs();
  }

  // ================= PERSON LOADING =================

  loadPerson(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.personId = Number(idParam);

    // Person details
    this.peopleService.getPersonDetails(this.personId).subscribe(res => {
      this.personData = res;
      this.profileSrc = `https://image.tmdb.org/t/p/original/${res.profile_path}`;
    });

    // Known For
    this.peopleService.getPersonCredits(this.personId).subscribe(data => {
      this.knownFor = (data.cast || []).filter((x: any) => x.poster_path);
      this.loadKnownForTrailers();
    });

    // Combined credits (roles)
    this.peopleService.getCombinedCredits(this.personId).subscribe(data => {
      const hasActing = data.cast?.length > 0;
      const crewJobs = data.crew?.map((c: any) => c.job) || [];
      const uniqueJobs = new Set(crewJobs);

      this.roles = [];
      if (hasActing) this.roles.push('Actor');
      if (uniqueJobs.has('Writer')) this.roles.push('Writer');
      if (uniqueJobs.has('Director')) this.roles.push('Director');
      if (uniqueJobs.has('Producer')) this.roles.push('Producer');
    });
  }

  // ================= MORE TO EXPLORE =================

  getMoreToExploreCelebs(): void {
    this.peopleService.getPopularPeople(1).subscribe(res => {
      const all = res.results || [];
      this.moreToExploreCelebs = this.shuffle(all).slice(0, 3);
    });
  }

  shuffle(arr: any[]): any[] {
    return [...arr].sort(() => 0.5 - Math.random());
  }

  // ================= BIO =================

  toggleBio(): void {
    this.showFullBio = !this.showFullBio;
  }

  // ================= TRAILERS =================

  async loadKnownForTrailers(limit = 6) {

    if (!this.knownFor.length) {
      this.trailers = [];
      return;
    }

    this.loadingTrailers = true;
    this.trailers = [];

    const pool = [...this.knownFor]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);

    const results = await Promise.all(
      pool.map(async item => {

        const mediaType: MT =
          item.media_type === 'tv' ? 'tv' : 'movie';

        const key = await this.movieService.getYoutubeTrailerKey(
          item.id,
          mediaType
        );

        return { item, key, mediaType };
      })
    );

    this.trailers = results
      .filter(r => r.key)
      .map(({ item, key, mediaType }) => {

        const base =
          `https://www.youtube-nocookie.com/embed/${key}?rel=0&modestbranding=1&playsinline=1`;

        return {
          id: item.id,
          mediaType,
          title: item.title || item.name,
          poster: item.backdrop_path || item.poster_path || null,
          key: key!,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(base),
          urlAuto: this.sanitizer.bypassSecurityTrustResourceUrl(base + '&autoplay=1&mute=1'),
          playing: false
        };
      });

    this.loadingTrailers = false;
  }

  playTrailer(t: TrailerClip) {
    t.playing = true;
  }

  stopTrailer(t: TrailerClip) {
    t.playing = false;
  }

  trackById(_: number, item: { id: number }) {
    return item.id;
  }

  goBack(): void {
    history.back();
  }

  // ================= CAROUSEL =================

  customOptions: OwlOptions = {
    loop: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 4 }
    },
    nav: true
  };
}
