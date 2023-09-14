import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
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
