import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
export class SignUpComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
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
  }

  async onSubmit() {
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
      console.log(error);
    }
  }
}
