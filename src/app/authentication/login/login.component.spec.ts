import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
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
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
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
    component.email = mockUser.email!;
    component.password = mockUser.password!;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.signInUser() on form submission', () => {
    const authServiceSpy = spyOn(authService, 'signInUser').and.returnValue(
      of({})
    );
    const routerSpy = spyOn(router, 'navigate');
    const snackbarServiceSpy = spyOn(snackbarService, 'showError');

    component.onSubmit();

    expect(authServiceSpy).toHaveBeenCalled();
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

  it('should show an error message when the login fails', () => {
    const errorMessage = 'Authentication failed';
    spyOn(authService, 'signInUser').and.returnValue(throwError(errorMessage));
    const snackbarServiceSpy = spyOn(snackbarService, 'showError');

    component.onSubmit();

    expect(snackbarServiceSpy).toHaveBeenCalledWith(errorMessage);
  });
});
