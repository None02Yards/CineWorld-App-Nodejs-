import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-free-to-watch',
  templateUrl: './free-to-watch.component.html',
  styleUrls: ['./free-to-watch.component.scss']
})
export class FreeToWatchComponent implements OnInit {
  freeTab: 'movie' | 'tv' = 'movie';
  freeMovies: any[] = [];
  freeTV: any[] = [];

  constructor(private _DataService: DataService) {}


  ngOnInit(): void {
  this.fetchFreeToWatch('movie');
  this.fetchFreeToWatch('tv');
}

private shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}


fetchFreeToWatch(type: 'movie' | 'tv'): void {
  this._DataService.getFreeToWatch(type).subscribe({
    next: (res: any) => {

      const shuffled = this.shuffleArray(
        (res.results ?? []).filter((m: any) => m.poster_path)
      );

      if (type === 'movie') {
        this.freeMovies = shuffled.slice(0, 12);
      } else {
        this.freeTV = shuffled.slice(0, 12);
      }
    }
  });
}


}

