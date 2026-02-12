
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { filter } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of, combineLatest, BehaviorSubject } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showMenuItem = true;
  showSearch = false;
  isCollapsed = true;

  searchControl = new FormControl('');
  searchQuery = '';
  // searchType: 'multi' | 'person' | 'keyword' = 'multi'; // All is default
  searchResults: any[] = [];
  showDropdown = false;
  dropdownOpen = false;
 searchForm!: FormGroup;


  isCelebsPage = false;
  isScrolled = false;
  isWelcomePage = false;
  isWatchlistPage = false;
  isWatchMoviesPage=false;
  isWatchTvPage=false;

  isMediaPage = false;
  hideNavbar = false;

  navCondensed = false;
  isDetailsPage = false;

  // hide whole navbar until hero ends (only on /details)
  hideUntilHeroEnd = false;

  private heroObserver?: IntersectionObserver;
  private sentinelQuery = '#hero-end-sentinel';
  private attachTries = 0;
  private searchTimeout: any;


  private updateNavbarFlags(currentUrl: string): void {
  this.isWelcomePage =
    currentUrl.includes('/welcome') ||
    currentUrl.includes('/profile');

  this.isWatchlistPage = currentUrl.includes('/watchlist');

  this.isMediaPage =
    currentUrl.includes('/movies') ||
    currentUrl.includes('/tvshows') ||
    currentUrl.includes('/search') ||
    currentUrl.includes('/home') ||
    currentUrl.includes('/watchlist/tv') ||
    currentUrl.includes('/watchlist/movies');

  const isHomePage =
    currentUrl === '/' || currentUrl === '/home';

  this.showSearch = !(this.isWelcomePage || isHomePage);
  this.showMenuItem = !this.isWelcomePage;

  const isPersonDetailsPage =
    currentUrl.includes('/person/');

  this.isCelebsPage =
    currentUrl.includes('/people') ||
    isPersonDetailsPage;

  this.hideNavbar = false;

  this.isDetailsPage =
    currentUrl.startsWith('/details/');

  this.navCondensed = false;
  this.hideUntilHeroEnd = false;

  if (!this.isDetailsPage) this.isScrolled = false;
}

private searchType$ = new BehaviorSubject<'multi' | 'person' | 'keyword'>('multi');




constructor(
  private _Router: Router,
  private _DataService: DataService,
  private fb: FormBuilder
) {}


  ngOnInit(): void {
    const initialUrl = this._Router.url;
    this.isWelcomePage = initialUrl.includes('/welcome');
    this.hideNavbar = false; 
    this.showMenuItem = true;
    this.showSearch = false;
    
    this.searchForm = this.fb.group({
  query: [''],
  type: ['multi']
});


    this._Router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const nav = event as NavigationEnd;
        this.updateNavbarFlags(nav.urlAfterRedirects);
        this.setupHeroObserverIfNeeded();
      });
    this.setupHeroObserverIfNeeded();


//     combineLatest([
// this.searchControl.valueChanges.pipe(
//     debounceTime(300),
//     distinctUntilChanged()
//   ),
//   this.searchType$
// ])

// .pipe(
//   switchMap(([query, type]) => {

//     if (!query || query.length < 2) {
//       this.searchResults = [];
//       this.showDropdown = false;
//       return of(null);
//     }

//     return this._DataService.searchByType(query, type);
//   })
// )
// .subscribe((res: any) => {

//   if (!res?.results) return;

//   const currentType = this.searchForm.get('type')?.value;

//   this.searchResults = res.results
//     .filter((item: any) => {

//       if (currentType === 'person') {
//         return item.profile_path;
//       }

//       return (
//         ['movie', 'tv', 'person'].includes(item.media_type) &&
//         (item.poster_path || item.profile_path)
//       );
//     })
//     .slice(0, 6);

//   this.showDropdown = this.searchResults.length > 0;



combineLatest([
  this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ),
  this.searchType$
])
.pipe(
  switchMap(([query, type]) => {

    if (!query || query.length < 2) {
      this.searchResults = [];
      this.showDropdown = false;
      return of(null);
    }

    return this._DataService.searchByType(query, type);
  })
)
.subscribe((res: any) => {

  if (!res?.results) return;

  const type = this.searchType$.value;

  this.searchResults = res.results
    .filter((item: any) => {

      // Person search does not return media_type
      if (type === 'person') {
        return item.profile_path;
      }

      return (
        ['movie', 'tv', 'person'].includes(item.media_type) &&
        (item.poster_path || item.profile_path)
      );
    })
    .slice(0, 6);

  this.showDropdown = this.searchResults.length > 0;


    this.searchForm = this.fb.group({
  query: [''],
  type: ['multi']
});



});



    // initially
    this.updateNavbarFlags(this._Router.url);
  }

  ngOnDestroy(): void {
    this.teardownHeroObserver();
  }

  // private updateNavbarFlags(currentUrl: string): void {
  //   this.isWelcomePage = currentUrl.includes('/welcome') || currentUrl.includes('/profile');

  //   // 1) Explicitly track the two watchlist children:
  //   // this.isWatchMoviesPage = currentUrl.includes('/watchlist/movies');
  //   // this.isWatchTvPage     = currentUrl.includes('/watchlist/tv');
  //   this.isWatchlistPage   = currentUrl.includes('/watchlist');

  //   this.isMediaPage = currentUrl.includes('/movies') || currentUrl.includes('/tvshows') || currentUrl.includes('/search') || currentUrl.includes('/home') || currentUrl.includes('/watchlist/tv') || currentUrl.includes('/watchlist/movies');

  //   const isHomePage = currentUrl === '/' || currentUrl === '/home';
  //   this.showSearch = !(this.isWelcomePage || isHomePage);
  //   this.showMenuItem = !this.isWelcomePage;

  //   const isPersonDetailsPage = currentUrl.includes('/person/');

  //   this.isCelebsPage = currentUrl.includes('/people') || isPersonDetailsPage;

  //   const isCustomListPage = currentUrl.includes('/watchlist/custom');
  //   const isCreateListPage = currentUrl.includes('/watchlist/create');

  //   this.showSearch = !(this.isWelcomePage || isHomePage) || isCustomListPage || isCreateListPage;
  //   this.showMenuItem = !this.isWelcomePage;

  //   //  Only hide on scroll for main /watchlist page, NOT its children
  //   this.hideNavbar = false;

  //   this.isDetailsPage = currentUrl.startsWith('/details/');
  //   this.navCondensed = false;
  //   this.hideUntilHeroEnd = false;

  //   // Reset scrolled style if not on details (observer will set it on details)
  //   if (!this.isDetailsPage) this.isScrolled = false;
  // }



  private setupHeroObserverIfNeeded(): void {
    this.teardownHeroObserver();
    if (!this.isDetailsPage) return;

    const tryAttach = () => {
      const sentinel = document.querySelector(this.sentinelQuery);
      if (!sentinel) {
        if (this.attachTries++ < 10) setTimeout(tryAttach, 100);
        return;
      }

      this.heroObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          // While sentinel is NOT intersecting (hero still onscreen):
          //  - hide whole navbar (no overlay over hero)
          //  - keep “condensed” state true (optional styling hook)
          //  - do not apply scrolled look yet
          const inHero = !entry.isIntersecting;
          this.hideUntilHeroEnd = inHero;
          this.navCondensed = inHero;

          // Once we pass hero (sentinel intersects), show navbar and apply scrolled look
          this.isScrolled = !inHero;
        },
        {
          root: null,
          rootMargin: '0px 0px -1px 0px',
          threshold: 0
        }
      );

      this.heroObserver.observe(sentinel);

      // Initialize state based on current scroll immediately
      const rect = (sentinel as HTMLElement).getBoundingClientRect();
      const inHero = rect.top > 0; // sentinel below top => hero still onscreen
      this.hideUntilHeroEnd = inHero;
      this.navCondensed = inHero;
      this.isScrolled = !inHero;
    };

    this.attachTries = 0;
    tryAttach();
  }

  private teardownHeroObserver(): void {
    if (this.heroObserver) {
      this.heroObserver.disconnect();
      this.heroObserver = undefined;
    }
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  hoverDropdown(isHovering: boolean) {
    this.dropdownOpen = isHovering;
  }

   selectSearchType(type: 'multi' | 'person' | 'keyword') {
  this.searchType$.next(type);
  this.dropdownOpen = false;
}




  targetInfo(event: Event | undefined): void {
    const input = event?.target as HTMLInputElement | null;
    this.searchQuery = input?.value ?? '';
  }




redirectToSearch(): void {
  const query = this.searchControl.value?.trim();
  if (!query) return;

  const type = this.searchType$.value;

  if (type === 'person') {
    this._DataService.searchByType(query, 'person').subscribe((res: any) => {
      if (!res?.results?.length) {
        this._Router.navigate(['/notfound']);
        return;
      }

      const validPeople = res.results.filter((person: any) =>
        person.profile_path && person.popularity > 3
      );

      const bestMatch =
        validPeople.find((p: any) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        ) || validPeople[0];

      if (bestMatch) {
        this._Router.navigate(['/person', bestMatch.id]);
      } else {
        this._Router.navigate(['/notfound']);
      }
    });

    return;
  }

  this._Router.navigate(['/search'], {
    queryParams: {
      q: query,
      type: type
    }
  });

  this.searchControl.setValue('');
  this.searchResults = [];
  this.showDropdown = false;
}




  goToResult(item: any): void {
    this.searchResults = [];
    this.showDropdown = false;

    if (item.media_type === 'person') {
      this._Router.navigate(['/person', item.id]); 
    } else if (item.media_type === 'movie' || item.media_type === 'tv') {
      this._Router.navigate(['/details', item.media_type, item.id]);
    } else if (this.searchType$.value === 'keyword')
 {
      this._Router.navigate(['/search'], {
        queryParams: { keyword: item.name }
      });
    }
  }

  navigateWithFragment(fragment: string): void {
    const targetUrl = '/home';
    if (this._Router.url.startsWith(targetUrl)) {
      this.scrollToElement(fragment);
    } else {
      this._Router.navigate([targetUrl], { fragment }).then(() => {
        setTimeout(() => this.scrollToElement(fragment), 100);
      });
    }
  }

  private scrollToElement(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    if (this.isDetailsPage) return;

  

    const scrollY = window.scrollY || window.pageYOffset;
    const currentUrl = this._Router.url;

    const isMainWatchlist = currentUrl === '/watchlist';
    const isCustomListPage = currentUrl.includes('/watchlist/custom');
    const isCreateListPage = currentUrl.includes('/watchlist/create');

    const isWelcomePage = currentUrl.includes('/welcome') || currentUrl.includes('/profile');

    if (isWelcomePage) {
      this.hideNavbar = false;  
      return;
    }
    if (
      currentUrl.startsWith('/watchlist/movies') ||
      currentUrl.startsWith('/watchlist/tv')
    ) {
      this.isScrolled = scrollY > 0;  // show full navbar on first scroll
      return;
    }

    if (isMainWatchlist) {
      this.hideNavbar = scrollY > 100;
      return;
    }

    if (isCustomListPage || isCreateListPage) {
      this.hideNavbar = false;
      return;
    }

    if (
      currentUrl.includes('/tvshows') ||
      currentUrl.includes('/people') ||
      currentUrl.includes('/movies') ||
      currentUrl.includes('/person/') ||
      currentUrl.includes('/search') 
    ) {
      this.isScrolled = true;
      this.showSearch = true;
    } else {
      const heroHeight = 700;
      this.isScrolled = scrollY > heroHeight;
      this.showSearch = this.isScrolled;
    }
  }

  @HostListener('document:click')
onDocumentClick() {
  this.showDropdown = false;
}
}
