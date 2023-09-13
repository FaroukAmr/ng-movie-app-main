import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private translate: TranslateService,
    private titleService: Title
  ) {
    this.email = '';
    this.password = '';
  }

  ngOnInit() {
    this.titleService.setTitle(this.translate.instant('login'));
  }

  onSubmit() {
    const user: User = {
      email: this.email,
      password: this.password,
    };
    this.authService.signInUser(user).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.snackbarService.showError(error);
      }
    );
  }
}
