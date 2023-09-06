import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/snackbar.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private translate: TranslateService,
    private titleService: Title
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.translate.onLangChange.subscribe(() => {
      this.titleService.setTitle(this.translate.instant('login'));
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.translate.instant('login'));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackbarService.showError('Invalid input');
      return;
    }
    const user: User = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.signInUser(user).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.snackbarService.showError(error);
        console.log(error);
      }
    );
  }
}
