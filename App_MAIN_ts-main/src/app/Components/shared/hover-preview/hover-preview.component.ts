import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';




@Component({
  selector: 'app-hover-preview',
  templateUrl: './hover-preview.component.html',
  styleUrls: ['./hover-preview.component.scss']
})
export class HoverPreviewComponent implements OnInit, OnDestroy {

  /* =========================
     Inputs
  ========================== */

  @Input() item!: any;
  @Input() mediaType!: 'movie' | 'tv';

  // ✅ Use numbers (not strings)
  @Input() position!: { top: number; left: number };

  /* =========================
     Outputs
  ========================== */

  @Output() close = new EventEmitter<void>();
  @Output() open = new EventEmitter<{ item: any; type: 'movie' | 'tv' }>();





  /* =========================
     Internal State
  ========================== */

  genres: string[] = [];

  /* =========================
     Lifecycle
  ========================== */

  ngOnInit(): void {
    // Lock background scroll (optional Netflix style)
    document.body.classList.add('preview-open');

    if (this.item?.genre_names) {
      this.genres = this.item.genre_names;
    } else {
      // fallback demo genres
      this.genres = ['Suspenseful', 'Mystery', 'Drama'];
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('preview-open');
  }

  /* =========================
     ESC Close Listener
  ========================== */

  @HostListener('document:keydown', ['$event'])
handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    this.emitClose();
  }
}


  /* =========================
     Methods
  ========================== */

  emitClose(): void {
    this.close.emit();
  }

  openModal(event: MouseEvent): void {
    event.stopPropagation();

    this.open.emit({
      item: this.item,
      type: this.mediaType
    });
  }

  /* =========================
     Getters
  ========================== */

  get title(): string {
    return this.item?.title || this.item?.name || '';
  }

  get year(): string {
    return (
      this.item?.release_date?.substring(0, 4) ||
      this.item?.first_air_date?.substring(0, 4) ||
      ''
    );
  }

  get shortOverview(): string {
    if (!this.item?.overview) return '';

    return this.item.overview.length > 120
      ? this.item.overview.slice(0, 120) + '...'
      : this.item.overview;
  }
}
