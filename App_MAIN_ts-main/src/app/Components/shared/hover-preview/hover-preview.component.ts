
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { WatchlistService } from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-hover-preview',
  templateUrl: './hover-preview.component.html',
  styleUrls: ['./hover-preview.component.scss']
})


export class HoverPreviewComponent implements OnInit {

  @Input() item!: any;
  @Input() mediaType!: 'movie' | 'tv';
  @Input() position!: { top: number; left: number };

  @Output() close = new EventEmitter<void>();

  @ViewChild('cardRef') cardRef!: ElementRef;
  genres: string[] = [];
  showOverview = false;
  isInWatchlist = false;
  showAuthToast = false;

  expanded = false;

  isFadingOut = false;


  constructor(
    private router: Router,
    private dataService: DataService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.checkWatchlistStatus();
  }
private readonly OVERVIEW_LIMIT = 150;


  /* ===============================
     WATCHLIST LOGIC
  ================================== */

  private checkWatchlistStatus(): void {
    this.isInWatchlist = this.watchlistService.isInWatchlist(
      this.item.id,
      this.mediaType
    );
  }

  toggleWatchlist(event: MouseEvent): void {
    event.stopPropagation();

    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(
        this.item.id,
        this.mediaType
      );
    } else {
      this.watchlistService.addToWatchlist({
        id: this.item.id,
        type: this.mediaType,
        name: this.item.title || this.item.name
      });
    }

    this.checkWatchlistStatus();
  }

  /* ===============================
     GENRES
  ================================== */

  private loadGenres(): void {
    if (!this.item?.genre_ids?.length) return;

    this.dataService.getGenres(this.mediaType).subscribe({
      next: (res: any) => {
        const map = new Map<number, string>();
        res.genres.forEach((g: any) => map.set(g.id, g.name));

        this.genres = this.item.genre_ids
          .map((id: number) => map.get(id))
          .filter(Boolean)
          .slice(0, 3);
      }
    });
  }



  /* ===============================
     BUTTONS
  ================================== */

  goToDetails(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/details', this.mediaType, this.item.id]);
    this.close.emit();
  }

toggleOverview(event: MouseEvent) {
  event.stopPropagation();
  this.showOverview = !this.showOverview;
}

private adjustPosition(): void {
  if (!this.cardRef) return;

  const el = this.cardRef.nativeElement;
  const rect = el.getBoundingClientRect();

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gutter = 12;

  let top = rect.top;
  let left = rect.left;

  if (rect.bottom > vh - gutter) {
    top = Math.max(gutter, vh - rect.height - gutter);
  }

  if (rect.right > vw - gutter) {
    left = vw - rect.width - gutter;
  }

  el.style.top = `${top}px`;
  el.style.left = `${left}px`;
}



toggleExpand(event: MouseEvent): void {
  event.stopPropagation();
  this.expanded = !this.expanded;

  setTimeout(() => {
    this.adjustPosition();
  }, 50);
}



  emitClose(): void {
    this.close.emit();
  }



//  get shortOverview(): string {
//     if (!this.item?.overview) return '';
//     return this.item.overview.length > 160
//       ? this.item.overview.slice(0, 160) + '...'
//       : this.item.overview;
//   }


// get shortOverview(): string {
//   if (!this.item?.overview) return '';

//   const text = this.item.overview.trim();

//   if (text.length <= this.OVERVIEW_LIMIT) {
//     return text;
//   }

//   const truncated = text.slice(0, this.OVERVIEW_LIMIT);
//   const lastSpace = truncated.lastIndexOf(' ');

//   return truncated.slice(0, lastSpace > 0 ? lastSpace : this.OVERVIEW_LIMIT) + '...';
// }

get shortOverview(): string {
  if (!this.item?.overview) return '';

  const text = this.item.overview.trim();

  return text.length > this.OVERVIEW_LIMIT
    ? text.slice(0, this.OVERVIEW_LIMIT) + '...'
    : text;
}



private fadeAndClose(): void {
  if (this.isFadingOut) return;

  this.isFadingOut = true;

  setTimeout(() => {
    this.emitClose();
  }, 200); // match CSS animation duration
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  if (!this.cardRef) return;

  const clickedInside =
    this.cardRef.nativeElement.contains(event.target as Node);

  if (!clickedInside) {
    this.emitClose();
  }
}

@HostListener('document:keydown', ['$event'])
onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    this.emitClose();
  }
}

@HostListener('window:scroll')
onWindowScroll() {
  this.fadeAndClose();
}


triggerAuthToast(event: MouseEvent) {
  event.stopPropagation();

  this.showAuthToast = true;

  // Auto hide after 4 seconds
  setTimeout(() => {
    this.showAuthToast = false;
  }, 5000);
}

goToLogin() {
  this.emitClose(); 
  window.location.href = '/login'; 
}

}
