import { Component, OnDestroy } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnDestroy {
  isAuthenticated: boolean = false;
  username: string = '';
  private userSubscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
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

  handleLoginClick() {
    this.router.navigate(['auth', 'login']);
  }

  handleLogoutClick() {
    this.authService.signOutUser().subscribe(() => {
      this.router.navigate(['auth', 'login']);
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}