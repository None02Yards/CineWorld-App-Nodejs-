// src/app/guards/profile.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ProfileService } from '../Services/profile.service';

@Injectable({ providedIn: 'root' })
export class ProfileGuard implements CanActivate {

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const profile = this.profileService.getActiveProfile();

    if (!profile) {
      this.router.navigate(['/profile']);
      return false;
    }

    // Prevent non-kids from accessing kids
    if (route.routeConfig?.path === 'kids' && !profile.isKids) {
      this.router.navigate(['/home']);
      return false;
    }

    // Prevent kids profile from accessing home
    if (route.routeConfig?.path === 'home' && profile.isKids) {
      this.router.navigate(['/kids']);
      return false;
    }

    return true;
  }
}
