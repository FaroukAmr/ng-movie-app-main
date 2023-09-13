import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/snackbar.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private translate: TranslateService,
    private titleService: Title
  ) {
    this.translate.onLangChange.subscribe(() => {
      this.titleService.setTitle(this.translate.instant('signUp'));
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.translate.instant('signUp'));
  }

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.snackbarService.showError(
        this.translate.instant('validators.confirmPassword')
      );
      return;
    }

    if (this.username.length < 3) {
      this.snackbarService.showError(
        this.translate.instant('validators.username')
      );
      return;
    }

    if (this.password.length < 6) {
      this.snackbarService.showError(
        this.translate.instant('validators.password')
      );
      return;
    }

    const user: User = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    try {
      await this.authService.registerUser(user);
      await this.authService.updateProfile(user.username!);
      this.authService.signOutUser().subscribe(() => {
        this.router.navigate(['auth', 'login']);
      });
    } catch (error) {
      this.snackbarService.showError(error as string);
    }
  }
}
