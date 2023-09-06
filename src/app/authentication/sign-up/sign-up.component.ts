import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/snackbar.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user.model';

function passwordMatchValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (
    password?.value !== confirmPassword?.value &&
    password?.dirty &&
    confirmPassword?.dirty
  ) {
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private translate: TranslateService,
    private titleService: Title
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );

    this.translate.onLangChange.subscribe(() => {
      this.titleService.setTitle(this.translate.instant('signUp'));
    });
  }
  ngOnInit() {
    this.titleService.setTitle(this.translate.instant('signUp'));
  }

  async onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const user: User = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };

    try {
      await this.authService.registerUser(user);
      await this.authService.updateProfile(user.username!);
      this.authService.signOutUser().subscribe(() => {
        this.router.navigate(['auth', 'login']);
      });
    } catch (error) {
      this.snackbarService.showError(error as string);
      console.log(error);
    }
  }
}
