
// watchlist.services
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject  } from 'rxjs';

export interface StoredWatchlistItem {
  id: number;
  type: 'movie' | 'tv' | 'anime';
  addedAt?: string;
    name?: string; 

}
export interface CustomList {


  id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  items: any[];
  modifiedAt?: string;
    color?: string; 
     size: 'small' | 'medium' | 'large';
    avatar?: string;
    
}

export interface WatchlistItem extends StoredWatchlistItem {
  title: string;
  poster_path: string;
}
// add near your other interfaces
export interface WatchlistMenuState {
  anchor: HTMLElement;
  item?: WatchlistItem;
  mediaType?: 'movie' | 'tv' | 'anime';
  customLists?: CustomList[];
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private storageKey = 'watchlist';
  private customListsKey = 'customLists';

likedCount = 0;
private customListsSubject = new BehaviorSubject<CustomList[]>(
  JSON.parse(localStorage.getItem(this.customListsKey) || '[]')
);

customLists$ = this.customListsSubject.asObservable();

  private watchlistChangedSource = new Subject<void>();
  watchlistChanged$ = this.watchlistChangedSource.asObservable();

private likedKey = 'liked';

  constructor() {
    this.migrateLegacyWatchlist();
  this.migrateDates(); 
    this.migrateCreatedAt(); // 👈 ADD THIS

    
  }

  getWatchlist(): StoredWatchlistItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveWatchlist(list: StoredWatchlistItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }


//   getCustomLists(): CustomList[] {
//   return this.customListsSubject.value;
// }

   addToWatchlist(item: StoredWatchlistItem): void {
    const list = this.getWatchlist();
    const exists = list.some(x => x.id === item.id && x.type === item.type);
    if (!exists) {
      list.push({ ...item, addedAt: new Date().toISOString() });
      this.saveWatchlist(list);
      this.watchlistChangedSource.next(); // <== notify listeners
    }
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): void {
    const list = this.getWatchlist().filter(item => !(item.id === id && item.type === type));
    this.saveWatchlist(list);
    this.watchlistChangedSource.next(); // <== notify listeners
  }
  //  Check if item exists
  isInWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): boolean {
    return this.getWatchlist().some(item => item.id === id && item.type === type);
  }

  //  Filter by type
  getByType(type: 'movie' | 'tv' | 'anime'): StoredWatchlistItem[] {
    return this.getWatchlist().filter(item => item.type === type);
  }

  getCreatedDateFormatted(item: { createdAt?: string }): string {
  if (!item.createdAt) return 'N/A';

  return new Date(item.createdAt).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  );
}

  
  private migrateLegacyWatchlist(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && typeof parsed[0] === 'number') {
        const migrated: StoredWatchlistItem[] = parsed.map((id: number) => ({
          id,
          type: 'movie'
        }));
        this.saveWatchlist(migrated);
        console.log('[WatchlistService] Migrated legacy watchlist format.');
      }
    } catch (err) {
      console.warn('[WatchlistService] Failed to parse legacy watchlist.', err);
    }
  }
private _menuState = new BehaviorSubject<WatchlistMenuState | null>(null);
  menuState$ = this._menuState.asObservable();
  openMenu(state: WatchlistMenuState) { this._menuState.next(state); }
  closeMenu() { this._menuState.next(null); }
  //  ------ CUSTOM LIST SUPPORT ------

  private customLists: {
    id: string;
    name: string;
    description: string;
    privacy: 'public' | 'private';
    items: any[];
  }[] = [];
  
/* ------------ CUSTOM LISTS (FINAL CLEAN VERSION) ------------ */

// getCustomLists(): CustomList[] {
//   return JSON.parse(localStorage.getItem(this.customListsKey) || '[]');
// }

getCustomLists(): CustomList[] {
  return this.customListsSubject.value;
}

getCustomListById(id: string): CustomList | undefined {
  return this.getCustomLists().find(list => list.id === id);
}

saveCustomList(list: CustomList): void {
  const lists = this.getCustomLists();
  lists.push({
    ...list,
    modifiedAt: new Date().toISOString()
  });

  localStorage.setItem(this.customListsKey, JSON.stringify(lists));
  this.watchlistChangedSource.next();
}

// updateCustomLists(lists: CustomList[]): void {
//   localStorage.setItem(this.customListsKey, JSON.stringify(lists));
//   this.watchlistChangedSource.next();
// }


updateCustomLists(lists: CustomList[]): void {
  localStorage.setItem(this.customListsKey, JSON.stringify(lists));
  this.customListsSubject.next(lists);
}

deleteCustomList(id: string): void {
  const updated = this.getCustomLists().filter(l => l.id !== id);
  localStorage.setItem(this.customListsKey, JSON.stringify(updated));
  this.watchlistChangedSource.next();
}

/* ---------- GET ---------- */

getLiked(): any[] {
  const raw = localStorage.getItem(this.likedKey);
  return raw ? JSON.parse(raw) : [];
}

/* ---------- SAVE ---------- */

private saveLiked(list: any[]): void {
  localStorage.setItem(this.likedKey, JSON.stringify(list));
}

/* ---------- ADD ---------- */

addToLiked(item: any): void {

  const list = this.getLiked();

  const exists = list.some(x => x.id === item.id);

  if (!exists) {

    list.push({
      ...item,
      likedAt: new Date().toISOString()
    });

    this.saveLiked(list);
  }
}

/* ---------- REMOVE ---------- */

removeFromLiked(id: number): void {

  const updated =
    this.getLiked().filter(item => item.id !== id);

  this.saveLiked(updated);
}

/* ---------- CHECK ---------- */

isInLiked(id: number): boolean {

  return this.getLiked().some(item => item.id === id);
}


/* ============================= */
/* DATE MIGRATION                */
/* ============================= */

private migrateDates(): void {
  const lists = this.getCustomLists();

  lists.forEach((list: CustomList) => {
    list.items.forEach((item: any) => {
      if (!item.createdAt && item.addedAt) {
        item.createdAt = item.addedAt;
        delete item.addedAt;
      }
      if (!item.createdAt && item.likedAt) {
        item.createdAt = item.likedAt;
        delete item.likedAt;
      }
    });
  });

  this.updateCustomLists(lists);
}

private migrateCreatedAt(): void {

  const lists = this.getCustomLists();
  let updated = false;

  lists.forEach((list: CustomList) => {
    list.items.forEach((item: any) => {

      if (!item.createdAt) {
        item.createdAt = new Date().toISOString();
        updated = true;
      }

    });
  });

  if (updated) {
    this.updateCustomLists(lists);
  }
}

/* ============================= */
/* ADD TO CUSTOM LIST            */
/* ============================= */

addToCustomList(listId: string, item: any): void {

  const lists = this.getCustomLists();

  const list = lists.find(
    (l: CustomList) => l.id === listId
  );

  if (!list) return;

  const exists = list.items.some(
    (i: any) => i.id === item.id
  );

  if (exists) return;

  // 🔥 CORE LOGIC
  const newItem = {
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  };

  list.items.push(newItem);

  this.updateCustomLists(lists);
}
}