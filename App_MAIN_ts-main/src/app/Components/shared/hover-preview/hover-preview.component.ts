
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

  constructor(
    private router: Router,
    private dataService: DataService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.checkWatchlistStatus();
  }

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


  emitClose(): void {
    this.close.emit();
  }

 get shortOverview(): string {
    if (!this.item?.overview) return '';
    return this.item.overview.length > 160
      ? this.item.overview.slice(0, 160) + '...'
      : this.item.overview;
  }
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  if (!this.cardRef) return;

  const clickedInside = this.cardRef.nativeElement.contains(event.target);

  if (!clickedInside) {
    this.emitClose();
  }
}

}
