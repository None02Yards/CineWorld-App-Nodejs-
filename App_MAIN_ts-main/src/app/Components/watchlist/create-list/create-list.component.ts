
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { WatchlistService, CustomList } from 'src/app/Services/watchlist.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/styles/overlayscrollbars.css';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
  animations: [
    trigger('fadeSwitch', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CreateListComponent
  implements OnInit, AfterViewInit, OnDestroy {

  pendingRemoval: any = null;
  toastVisible = false;
  toastTimeout: any;

  customLists: CustomList[] = [];
  selectedList: CustomList | null = null;

  isSidebarOpen = true;
  activeRowMenu: number | null = null;

  showTopbar = false;
  showScrollHeader = false;

  likedCount = 0;
  likeToastVisible = false;
  likeToastMessage = '';


tableOffset = 0;

activeRowMenuItem: any = null;
menuX = 0;
menuY = 0;
menuWidth = 220;
menuHeight = 180; 


contextMenuVisible = false;
contextMenuX = 0;
contextMenuY = 0;
contextMenuItem: any = null;

  private likeToastTimeout: any;
  private sidebarOsInstance: any = null;
  private contentScrollHandler!: () => void;

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sidebarScroll') sidebarScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('contentScroll') contentScroll!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private watchlistService: WatchlistService
  ) {}

  /* ============================= */
  /* INIT                          */
  /* ============================= */

  ngOnInit(): void {

    this.customLists = this.watchlistService.getCustomLists();
    this.likedCount = this.watchlistService.getLiked().length;

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.selectedList = null;
        return;
      }

      if (id === 'liked') {
        this.selectLikedList();
        return;
      }

      this.customLists = this.watchlistService.getCustomLists();
      this.selectedList =
        this.customLists.find(l => l.id === id) || null;
    });

    this.watchlistService.watchlistChanged$
      .subscribe(() => {

        this.likedCount =
          this.watchlistService.getLiked().length;

        const currentId = this.selectedList?.id;

        this.customLists =
          this.watchlistService.getCustomLists();

        if (!currentId) return;

        if (currentId === 'liked') {
          this.selectLikedList();
          return;
        }

        this.selectedList =
          this.customLists.find(l => l.id === currentId) || null;
      });
  }

onRightClick(event: MouseEvent, item: any): void {
  event.preventDefault();
  event.stopPropagation(); 

  this.contextMenuVisible = true;
  this.contextMenuX = event.clientX;
  this.contextMenuY = event.clientY;
  this.contextMenuItem = item;
}




private contentOsInstance: any = null;
// private sidebarOsInstance: any = null;


ngAfterViewInit(): void {

  /* ========================= */
  /* SIDEBAR SCROLL            */
  /* ========================= */

  if (this.sidebarScroll?.nativeElement) {
    this.sidebarOsInstance = OverlayScrollbars(
      this.sidebarScroll.nativeElement,
      {
        scrollbars: {
          theme: 'os-theme-vscode',
          autoHide: 'leave',
          autoHideDelay: 200,
          dragScroll: true,
          clickScroll: false
        },
        overflow: {
          x: 'hidden',
          y: 'scroll'
        }
      }
    );
  }

  /* ========================= */
  /* MAIN CONTENT SCROLL       */
  /* ========================= */

  if (this.contentScroll?.nativeElement) {

    this.contentOsInstance = OverlayScrollbars(
      this.contentScroll.nativeElement,
      {
        scrollbars: {
          theme: 'os-theme-vscode',
          autoHide: 'leave',
          autoHideDelay: 200,
          dragScroll: true,
          clickScroll: false
        },
        overflow: {
          x: 'hidden',
          y: 'scroll'
        }
      }
    );

   const viewport = this.contentOsInstance.elements().viewport;

viewport.addEventListener('scroll', () => {

  const scrollTop = viewport.scrollTop;

  const headerElement =
    this.contentScroll.nativeElement
      .querySelector('.content-header') as HTMLElement;

  const headerHeight = headerElement?.offsetHeight || 0;

  const topbarHeight = 64;

  // When header is collapsing
  const collapseStart = headerHeight - topbarHeight;

  if (scrollTop <= collapseStart) {

    // Progress between 0 and 1
    const progress = scrollTop / collapseStart;

    // Offset moves smoothly from 0 → topbarHeight
    this.tableOffset = progress * topbarHeight;

  } else {

    this.tableOffset = topbarHeight;
  }

   if (this.activeRowMenuItem) {
    this.activeRowMenuItem = null;
  }

  // Show floating header only when fully collapsed
  this.showTopbar = scrollTop > collapseStart;

});}



const viewport = this.contentOsInstance.elements().viewport;
viewport.style.overflow = 'visible';
}
ngOnDestroy(): void {

  if (this.sidebarOsInstance?.destroy) {
    this.sidebarOsInstance.destroy();
    this.sidebarOsInstance = null;
  }

  if (this.contentOsInstance?.destroy) {
    this.contentOsInstance.destroy();
    this.contentOsInstance = null;
  }
}



private handleMainScroll(): void {

  if (!this.contentOsInstance) return;

  const scrollY = this.contentOsInstance.state().scroll.y;

  const headerElement =
    this.contentScroll.nativeElement
      .querySelector('.content-header') as HTMLElement;

  if (!headerElement) return;

  const headerHeight = headerElement.offsetHeight;

  // 🔥 Show when big header is mostly gone
  this.showTopbar = scrollY > (headerHeight - 80);
}



 
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.showScrollHeader = target.scrollTop > 180;
  }

 

  drop(event: CdkDragDrop<any[]>): void {
    if (!this.selectedList) return;

    moveItemInArray(
      this.selectedList.items,
      event.previousIndex,
      event.currentIndex
    );

    this.persistChanges();
  }

  selectList(list: CustomList): void {
    this.router.navigate(['/create-list'], {
      queryParams: { id: list.id }
    });
  }

  selectLikedList(): void {
    const likedItems = this.watchlistService.getLiked();

    this.selectedList = {
      id: 'liked',
      name: 'Liked',
      description: '',
      privacy: 'private',
      size: 'medium',
      items: likedItems
    };
  }

  get movableLists(): CustomList[] {
    return this.customLists.filter(l => l.id !== 'liked');
  }

  trackByList(index: number, list: CustomList): string {
    return list.id;
  }

  trackByItem(index: number, item: any): number {
    return item.id;
  }


  removeItemFromList(itemId: number): void {
    if (!this.selectedList) return;

    this.selectedList.items =
      this.selectedList.items.filter(item => item.id !== itemId);

    this.persistChanges();
  }

  toggleItem(item: any): void {

    const index =
      this.selectedList!.items.findIndex(i => i.id === item.id);

    this.pendingRemoval = {
      item: { ...item },
      index
    };

    item.removing = true;

    setTimeout(() => {
      this.selectedList!.items.splice(index, 1);
      this.persistChanges();
      this.showToast();
    }, 300);
  }



  isLiked(item: any): boolean {
    return this.watchlistService.isInLiked(item.id);
  }



 isPinned(list: CustomList): boolean {
  return list.id === 'liked';
}


get isLikedList(): boolean {
  return this.selectedList?.id === 'liked';
}

get listAvatar(): string | null {

  if (!this.selectedList) return null;

  // 🔥 If liked list → return default image
  if (this.isLikedList) {
return 'assets/images/liked-songs-300.jpg'; 
 }

  // Otherwise return user avatar
  return this.selectedList.avatar || null;
}



  toggleLike(item: any): void {

    const liked = this.isLiked(item);

    if (liked) {
      this.watchlistService.removeFromLiked(item.id);

      if (this.selectedList?.id === 'liked') {
        this.selectedList.items =
          this.selectedList.items.filter(i => i.id !== item.id);
      }

      this.showLikeToast('Removed from Liked');

    } else {
      this.watchlistService.addToLiked(item);
      this.showLikeToast('Added to Liked');
    }
  }

  private showLikeToast(message: string): void {
    this.likeToastMessage = message;
    this.likeToastVisible = true;

    clearTimeout(this.likeToastTimeout);

    this.likeToastTimeout = setTimeout(() => {
      this.likeToastVisible = false;
    }, 2000);
  }



  moveItemToList(item: any, targetList: CustomList): void {

    if (!this.selectedList) return;

    this.selectedList.items =
      this.selectedList.items.filter(i => i.id !== item.id);

    const exists =
      targetList.items.some(i => i.id === item.id);

    if (!exists) {
      targetList.items.push(item);
    }

    const lists = this.watchlistService.getCustomLists();

    const updated = lists.map(list => {
      if (list.id === this.selectedList!.id)
        return { ...this.selectedList! };

      if (list.id === targetList.id)
        return { ...targetList };

      return list;
    });
this.watchlistService.addToCustomList(targetList.id, item);
    this.watchlistService.updateCustomLists(updated);
    this.activeRowMenu = null;
  }



  triggerAvatarUpload(): void {
    this.avatarInput.nativeElement.click();
  }

  onAvatarSelected(event: Event): void {

    if (!this.selectedList) return;

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      this.selectedList!.avatar = base64;

      const index = this.customLists.findIndex(
        l => l.id === this.selectedList!.id
      );

      if (index !== -1) {
        this.customLists[index].avatar = base64;
      }

      this.watchlistService.updateCustomLists([
        ...this.customLists
      ]);
    };

    reader.readAsDataURL(file);
  }




  showToast(): void {
    this.toastVisible = true;

    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
      this.pendingRemoval = null;
    }, 4000);
  }

  undoRemove(): void {

    if (!this.pendingRemoval) return;

    clearTimeout(this.toastTimeout);

    const { item, index } = this.pendingRemoval;

    item.removing = false;

    this.selectedList!.items.splice(index, 0, item);
    this.persistChanges();

    this.toastVisible = false;
    this.pendingRemoval = null;
  }



  getPoster(path: string): string {
    return `https://image.tmdb.org/t/p/w200${path}`;
  }


toggleRowMenu(item: any, event: MouseEvent): void {
  event.stopPropagation();

  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = rect.right - this.menuWidth;
  let y = rect.bottom + 6;

  /* ---------- Auto flip horizontally ---------- */
  if (x + this.menuWidth > viewportWidth - 8) {
    x = viewportWidth - this.menuWidth - 8;
  }

  if (x < 8) {
    x = 8;
  }

  /* ---------- Auto flip vertically ---------- */
  if (y + this.menuHeight > viewportHeight - 8) {
    y = rect.top - this.menuHeight - 6;
  }

  this.menuX = x;
  this.menuY = y;

  this.activeRowMenuItem =
    this.activeRowMenuItem?.id === item.id ? null : item;
}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private persistChanges(): void {

    if (!this.selectedList) return;

    const lists =
      this.watchlistService.getCustomLists();

    const index =
      lists.findIndex(l => l.id === this.selectedList!.id);

    if (index !== -1) {
      lists[index] = {
        ...this.selectedList,
        modifiedAt: new Date().toISOString()
      };

      this.watchlistService.updateCustomLists(lists);
      this.customLists = lists;
    }
  }




@HostListener('document:click')
onDocumentClick(): void {
  this.activeRowMenu = null;
  this.contextMenuVisible = false;
}
    @HostListener('window:scroll')
onWindowScroll() {
  this.activeRowMenuItem = null;
}


}