import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { MovieService } from '../home/movies.service';
import { SnackbarService } from '../snackbar.service';
import { TranslateModule } from '@ngx-translate/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const movieServiceMock = {
    getTopMovies: () => of({ results: [] }),
    searchMovies: (query: string) => of({ results: [] }),
  };
  const snackbarServiceMock = {
    showError: (message: string) => {},
  };
  const routeMock = {
    queryParamMap: of({ get: () => null }),
  };
  const routerMock = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [HomeComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call fetchTopMovies when data is stored in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ timestamp: Date.now(), data: [] })
    );
    const spy = spyOn(component, 'fetchTopMovies');
    component.ngOnInit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call fetchTopMovies when data is not stored in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const spy = spyOn(component, 'fetchTopMovies');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call fetchTopMovies when data is stored in localStorage but is older than 12 hours`, () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({
        timestamp: Date.now() - 12 * 60 * 60 * 1000 - 1,
        data: [],
      })
    );
    const spy = spyOn(component, 'fetchTopMovies');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call getTopMoviesFromLocalStorage when data is stored in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ timestamp: Date.now(), data: [] })
    );
    const spy = spyOn(component, 'getTopMoviesFromLocalStorage');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it(`should not call getTopMoviesFromLocalStorage when data is not stored in localStorage`, () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const spy = spyOn(component, 'getTopMoviesFromLocalStorage');
    component.ngOnInit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should return true and set topMovies when data is within timestamp', () => {
    const timestamp = Date.now() - 6 * 60 * 60 * 1000; // Within 12 hours
    const storedData = JSON.stringify({ timestamp, data: [] });
    expect(component.getTopMoviesFromLocalStorage(storedData)).toBeTruthy();
    expect(component.topMovies).toEqual([]);
  });

  it('should return false when data is outdated', () => {
    const timestamp = Date.now() - 24 * 60 * 60 * 1000; // More than 12 hours old
    const storedData = JSON.stringify({ timestamp, data: [] });
    expect(component.getTopMoviesFromLocalStorage(storedData)).toBeFalsy();
  });

  it('should call storeDataToLocalStorage', () => {
    const spy = spyOn(component, 'storeDataToLocalStorage');
    component.fetchTopMovies();
    expect(spy).toHaveBeenCalled();
  });
});
