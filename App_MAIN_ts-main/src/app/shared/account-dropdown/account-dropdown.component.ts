
import {
  Component,
  Input,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, Profile } from 'src/app/Services/profile.service';

interface DropdownItem {
  label: string;
  icon: string;
  action: 'manage' | 'transfer' | 'account' | 'help';
}

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.scss']
})
export class AccountDropdownComponent {

  @Input() activeProfile!: Profile | null;
  @Input() profiles: Profile[] = [];

  isOpen = false;
  isClosing = false;

  readonly dropdownItems: DropdownItem[] = [
    { label: 'Manage Profiles', icon: 'fa-pencil', action: 'manage' },
    { label: 'Transfer Profile', icon: 'fa-exchange', action: 'transfer' },
    { label: 'Account', icon: 'fa-user', action: 'account' },
    { label: 'Help Center', icon: 'fa-question-circle', action: 'help' }
  ];

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  private hoverTimeout?: any;
  /* =========================
     TOGGLE
  ========================= */

  // toggleDropdown(event: MouseEvent): void {
  //   event.stopPropagation();
  //   this.isOpen = !this.isOpen;
  // }

 openDropdown(): void {
  clearTimeout(this.hoverTimeout);

  this.isClosing = false;
  this.isOpen = true;
}

closeDropdown(): void {
  this.hoverTimeout = setTimeout(() => {
    this.isClosing = true;

    setTimeout(() => {
      this.isOpen = false;
      this.isClosing = false;
    }, 180); // match CSS
  }, 120); // small delay prevents flicker
}

  /* =========================
     PROFILE SWITCH
  ========================= */

  selectProfile(profile: Profile): void {
    this.profileService.setActiveProfile(profile);

    this.router.navigate([profile.isKids ? '/kids' : '/home']);
    this.closeDropdown();
  }

  /* =========================
     DYNAMIC ACTION HANDLER
  ========================= */

  handleAction(action: DropdownItem['action']): void {
    switch (action) {
      case 'manage':
        this.router.navigate(['/manage-profiles']);
        break;

      case 'transfer':
        this.router.navigate(['/transfer-profile']);
        break;

      case 'account':
        this.router.navigate(['/account']);
        break;

      case 'help':
        this.router.navigate(['/help']);
        break;
    }

    this.closeDropdown();
  }

  /* =========================
     LOGOUT
  ========================= */

  logout(): void {
    this.profileService.clearActiveProfile();
    this.router.navigate(['/profile']);
  }

  /* =========================
     OUTSIDE CLICK
  ========================= */

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.account-wrapper')) {
      this.isOpen = false;
    }
  }
}
