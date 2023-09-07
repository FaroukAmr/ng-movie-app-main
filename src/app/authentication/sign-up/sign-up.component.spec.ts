import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { SnackbarService } from 'src/app/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../models/user.model';
import { of } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: AuthenticationService;
  let router: Router;
  let snackbarService: SnackbarService;

  const mockUser: User = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        {
          provide: AuthenticationService,
          useValue: {
            registerUser: () => of({}),
            updateProfile: () => of({}),
            signOutUser: () => of({}),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
        {
          provide: SnackbarService,
          useValue: {
            showError: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    snackbarService = TestBed.inject(SnackbarService);

    component.signupForm.setValue({
      username: mockUser.username,
      email: mockUser.email,
      password: mockUser.password,
      confirmPassword: mockUser.password,
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signup form', () => {
    expect(component.signupForm.valid).toBe(true);
    expect(component.signupForm.get('username')!.value).toBe(mockUser.username);
    expect(component.signupForm.get('email')!.value).toBe(mockUser.email);
    expect(component.signupForm.get('password')!.value).toBe(mockUser.password);
    expect(component.signupForm.get('confirmPassword')!.value).toBe(
      mockUser.password
    );
  });

  it('should disable the submit button when the form is invalid', () => {
    component.signupForm.setValue({
      username: '',
      email: 'invalid-email',
      password: 'short',
      confirmPassword: 'password123',
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the submit button when the form is valid', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(false);
  });

  it('should call authService.registerUser with user data on form submission', async () => {
    const authServiceSpy = spyOn(authService, 'registerUser').and.returnValue(
      Promise.resolve()
    );

    await component.onSubmit();

    expect(authServiceSpy).toHaveBeenCalledWith(mockUser);
  });

  it('should call authService.updateProfile with the username on form submission', async () => {
    spyOn(authService, 'registerUser').and.returnValue(Promise.resolve());
    const updateProfileSpy = spyOn(
      authService,
      'updateProfile'
    ).and.returnValue(Promise.resolve());

    await component.onSubmit();

    expect(updateProfileSpy).toHaveBeenCalledWith(mockUser.username!);
  });

  it('should call authService.signOutUser on form submission', async () => {
    spyOn(authService, 'registerUser').and.returnValue(Promise.resolve());
    spyOn(authService, 'updateProfile').and.returnValue(Promise.resolve());
    const signOutUserSpy = spyOn(authService, 'signOutUser').and.returnValue(
      of({})
    );

    await component.onSubmit();

    expect(signOutUserSpy).toHaveBeenCalled();
  });

  it('should navigate to login page after successful form submission', async () => {
    spyOn(authService, 'registerUser').and.returnValue(Promise.resolve());
    spyOn(authService, 'updateProfile').and.returnValue(Promise.resolve());
    spyOn(authService, 'signOutUser').and.returnValue(of({}));
    const routerSpy = spyOn(router, 'navigate');

    await component.onSubmit();

    expect(routerSpy).toHaveBeenCalledWith(['auth', 'login']);
  });

  it('should handle authService.registerUser() error', async () => {
    const errorMessage = 'Registration failed';
    spyOn(authService, 'registerUser').and.returnValue(
      Promise.reject(errorMessage)
    );
    const snackbarServiceSpy = spyOn(snackbarService, 'showError');

    await component.onSubmit();

    expect(snackbarServiceSpy).toHaveBeenCalledWith(errorMessage);
  });
});
