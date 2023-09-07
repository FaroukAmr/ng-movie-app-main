import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationService } from '../authentication.service';
import { FormsModule } from '@angular/forms';
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
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
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
    component.username = mockUser.username!;
    component.email = mockUser.email!;
    component.password = mockUser.password!;
    component.confirmPassword = mockUser.password!;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
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
