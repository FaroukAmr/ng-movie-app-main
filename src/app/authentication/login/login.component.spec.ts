import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AuthenticationService } from '../authentication.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthenticationService;
  let router: Router;
  let snackbarService: SnackbarService;

  const mockUser: User = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        {
          provide: AuthenticationService,
          useValue: {
            signInUser: () => of({}),
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    snackbarService = TestBed.inject(SnackbarService);

    component.loginForm.setValue({
      email: mockUser.email,
      password: mockUser.password,
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm.valid).toBe(true);
    expect(component.loginForm.get('email')?.value).toBe(mockUser.email);
    expect(component.loginForm.get('password')?.value).toBe(mockUser.password);
  });

  it('should call authService.signInUser() on form submission', () => {
    const authServiceSpy = spyOn(authService, 'signInUser').and.returnValue(
      of({})
    );
    const routerSpy = spyOn(router, 'navigate');
    const snackbarServiceSpy = spyOn(snackbarService, 'showError');

    component.onSubmit();

    expect(authServiceSpy).toHaveBeenCalledWith(mockUser);
    expect(routerSpy).toHaveBeenCalledWith(['/']);
    expect(snackbarServiceSpy).not.toHaveBeenCalled();
  });

  it('should handle authService.signInUser() error', () => {
    const errorMessage = 'Authentication failed';
    spyOn(authService, 'signInUser').and.returnValue(throwError(errorMessage));
    const routerSpy = spyOn(router, 'navigate');
    const snackbarServiceSpy = spyOn(snackbarService, 'showError');

    component.onSubmit();

    expect(routerSpy).not.toHaveBeenCalled();
    expect(snackbarServiceSpy).toHaveBeenCalledWith(errorMessage);
  });

  it('should disable the submit button when the form is invalid', () => {
    component.loginForm.setValue({
      email: 'invalid-email',
      password: 'short',
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

  it('should not reset the form after a failed login', () => {
    spyOn(authService, 'signInUser').and.returnValue(
      throwError('Authentication failed')
    );
    const resetFormSpy = spyOn(component.loginForm, 'reset');

    component.onSubmit();

    expect(resetFormSpy).not.toHaveBeenCalled();
  });

  it('should show an error message when the login fails', () => {
    const errorMessage = 'Authentication failed';
    spyOn(authService, 'signInUser').and.returnValue(throwError(errorMessage));
    const snackbarServiceSpy = spyOn(snackbarService, 'showError');

    component.onSubmit();

    expect(snackbarServiceSpy).toHaveBeenCalledWith(errorMessage);
  });
});
