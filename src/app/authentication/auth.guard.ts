import { CanActivate, Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map((user) => {
        if (!user) {
          this.router.navigate(['auth', 'login']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
