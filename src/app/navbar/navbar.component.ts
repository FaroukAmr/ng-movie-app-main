import { Component, OnDestroy } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnDestroy {
  isAuthenticated: boolean = false;
  username: string = '';
  searchQuery: string = '';
  private userSubscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private translate: TranslateService
  ) {
    const currentLanguage = localStorage.getItem('currentLanguage') || 'en';
    this.translate.use(currentLanguage);

    this.userSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.username = user.displayName as string;
      } else {
        this.isAuthenticated = false;
        this.username = '';
      }
    });
  }

  handleSignUpClick() {
    this.router.navigate(['auth', 'signup']);
  }

  handleLogoutClick() {
    this.authService.signOutUser().subscribe(() => {
      this.router.navigate(['auth', 'login']);
    });
  }

  navigateToHome() {
    this.searchQuery = '';
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  handleSearch(query: string) {
    this.router.navigate([''], { queryParams: { query: query } });
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('currentLanguage', lang);
  }
}
