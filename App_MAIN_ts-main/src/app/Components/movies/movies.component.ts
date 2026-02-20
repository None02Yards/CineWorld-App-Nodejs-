


import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { DataService } from 'src/app/Services/data.service';
import {
  WatchlistService,
  WatchlistItem,
  CustomList
} from 'src/app/Services/watchlist.service';

interface MovieListItem {
  id: number;
  original_title: string;   // REQUIRED for your HTML
  title?: string;           // fallback safety
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  type = '';
  page = 1;
  pageTitle = '';

  movies: MovieListItem[] = [];
  displayedMovies: MovieListItem[] = [];

  totalPages = 1;

  customLists: CustomList[] = [];

  actionMenuForId: number | null = null;
  actionMenuItem: MovieListItem | null = null;
  dropdownPosition: { [k: string]: string } = {};

  showSubmenu = false;
  submenuFlipLeft = false;

  disablePrev = true;
  disableNext = false;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private watchlistService: WatchlistService
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.type = params['genre'] || 'popular';
      this.page = Number(params['page']) || 1;

      this.customLists = this.watchlistService.getCustomLists();
      this.pageTitle = this.getTitle(this.type);

      this.fetchMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================= FETCH ================= */

  fetchMovies(): void {
    this.spinner.show();

    this.dataService
      .getData<MovieListItem>('movie', this.type, this.page)
      .subscribe({
        next: (res) => {
          this.spinner.hide();

          this.movies = (res.results ?? [])
            .filter(m => !!m.poster_path);

          this.displayedMovies = this.movies.slice(0, 12);
          this.totalPages = res.total_pages ?? 1;

          this.updatePaginationButtons();
        },
        error: () => this.spinner.hide()
      });
  }

  /* ================= PAGINATION ================= */

  updatePaginationButtons(): void {
    this.disablePrev = this.page <= 1;
    this.disableNext = this.page >= this.totalPages;
  }

  Next(): void {
    if (!this.disableNext) {
      this.router.navigate(['/movies', this.type, this.page + 1]);
    }
  }

  Prev(): void {
    if (!this.disablePrev) {
      this.router.navigate(['/movies', this.type, this.page - 1]);
    }
  }

  /* ================= TITLE ================= */

  private getTitle(type: string): string {
    switch (type) {
      case 'now_playing': return 'Now Playing';
      case 'popular': return 'Popular Movies';
      case 'top_rated': return 'Top Rated Movies';
      case 'upcoming': return 'Upcoming Movies';
      default: return 'Movies';
    }
  }

  /* ================= TRACKBY ================= */

  trackById(_: number, item: MovieListItem): number {
    return item.id;
  }

  /* ================= WATCHLIST ================= */

  isInWatchlist(id: number): boolean {
    return this.watchlistService.isInWatchlist(id, 'movie');
  }

  isInAnyCustomList(id: number): boolean {
    return this.customLists.some(l =>
      l.items.some(i => i.id === id)
    );
  }

  isItemInList(item: MovieListItem, list: CustomList): boolean {
    return list.items.some(i => i.id === item.id);
  }

  toggleGeneralWatchlist(item: MovieListItem | null): void {
    if (!item) return;

    if (this.isInWatchlist(item.id)) {
      this.watchlistService.removeFromWatchlist(item.id, 'movie');
      this.toastr.info('Removed from watchlist');
    } else {
      this.watchlistService.addToWatchlist({
        id: item.id,
        type: 'movie'
      });
      this.toastr.success('Added to watchlist');
    }

    this.closeActionMenu();
  }

  addToCustomList(item: MovieListItem | null, list: CustomList): void {
    if (!item) return;

    const wlItem: WatchlistItem = {
      id: item.id,
      title: item.original_title,
      poster_path: item.poster_path || '',
      type: 'movie'
    };

    if (!this.isItemInList(item, list)) {
      list.items.push(wlItem);
      this.toastr.success(`Added to "${list.name}"`);
    } else {
      list.items = list.items.filter(i => i.id !== item.id);
      this.toastr.info(`Removed from "${list.name}"`);
    }

    this.watchlistService.updateCustomLists(this.customLists);
    this.closeActionMenu();
  }

  /* ================= DROPDOWN ================= */

  openActionMenu(item: MovieListItem, e: MouseEvent): void {
    e.stopPropagation();
    this.showSubmenu = false;

    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ddH = 700;
    const padding = 10;
    const scrollY = window.scrollY;

    const candidate = rect.top + scrollY + target.offsetHeight;
    const maxTop = scrollY + window.innerHeight - ddH - padding;
    const top = Math.min(candidate, maxTop);

    this.dropdownPosition = {
      top: `${top}px`,
      left: `${rect.left + window.scrollX}px`,
      zIndex: '9999'
    };

    this.actionMenuForId = item.id;
    this.actionMenuItem = item;
  }

  onSubmenuMouseEnter(event: MouseEvent): void {
    this.showSubmenu = true;

    const trigger = event.currentTarget as HTMLElement;
    const rect = trigger.getBoundingClientRect();
    const submenuWidth = 208;

    const spaceRight = window.innerWidth - rect.right;
    this.submenuFlipLeft = spaceRight < submenuWidth;
  }

  onSubmenuMouseLeave(): void {
    this.showSubmenu = false;
  }

  closeActionMenu(): void {
    this.actionMenuForId = null;
    this.actionMenuItem = null;
    this.showSubmenu = false;
  }

  /* ================= LISTENERS ================= */

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const el = event.target as HTMLElement;

    if (
      !el.closest('.spotify-dropdown') &&
      !el.classList.contains('overlay-btn')
    ) {
      this.closeActionMenu();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.closeActionMenu();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeActionMenu();
  }
}
