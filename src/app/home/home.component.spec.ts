import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { HomeComponent } from './home.component';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Movie } from '../models/movie.model';
import { MovieService } from '../home/movies.service';
import { SnackbarService } from '../snackbar.service';
import { Title } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const translateServiceMock = {
    onLangChange: of({ lang: 'en', translations: '' }),
    instant: (key: string) => key,
    get: (key: string) => of('key'),
  };

  const activatedRouteMock = {
    queryParamMap: of({ get: () => '' }),
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  };

  const snackbarServiceMock = {
    showError: jasmine.createSpy('showError'),
  };

  const titleServiceMock = {
    setTitle: jasmine.createSpy('setTitle'),
  };

  const mockData: Movie[] = [
    {
      id: 1,
      title: 'Movie 1',
      genres: [{ id: 1, name: 'action' }],
      overview: 'some overview',
      poster_path: 'some_path',
      release_date: '2023-01-01',
      vote_average: 5,
      vote_count: 100,
    },
    {
      id: 2,
      title: 'Movie 2',
      genres: [{ id: 1, name: 'drama' }],
      overview: 'some overview',
      poster_path: 'some_path',
      release_date: '2023-02-02',
      vote_average: 3,
      vote_count: 20,
    },
  ];

  const movieServiceMock = {
    getTopMovies: () => of([mockData]),
    searchMovies: (query: string, language: string) => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: 'en',
          loader: {
            provide: TranslateLoader,
            useFactory: httpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        MatProgressSpinnerModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: Title, useValue: titleServiceMock },
        { provide: MovieService, useValue: movieServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the loading spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const loadingSpinner = fixture.debugElement.nativeElement.querySelector(
      '.loading-spinner-overlay'
    );
    expect(loadingSpinner).toBeTruthy();
  });

  it('should call getTopMovies when query is empty in ngOnInit', () => {
    spyOn(component, 'getTopMovies');

    component.ngOnInit();

    expect(component.getTopMovies).toHaveBeenCalled();
  });

  it('should call fetchTopMovies when query is empty and no data is stored in localStorage', () => {
    spyOn(component, 'fetchTopMovies');
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.getTopMovies();

    expect(component.fetchTopMovies).toHaveBeenCalled();
  });

  it('should call getTopMovies when query is empty', () => {
    spyOn(component, 'getTopMovies');

    component.handleSearch();

    expect(component.getTopMovies).toHaveBeenCalled();
  });

  it('should call searchMovies when query is not empty', () => {
    const query = 'action';
    component.query = query;

    const movieSpy = spyOn(movieServiceMock, 'searchMovies').and.returnValue(
      of([])
    );

    component.handleSearch();

    expect(movieSpy).toHaveBeenCalledWith(query, component['currentLanguage']);
  });


  it('should return true on valid data', () => {
    const data = [{ id: 1, title: 'test' }] as Movie[];
    const dataToStore = {
      timestamp: Date.now(),
      data: data,
    };
    const dataToStoreString = JSON.stringify(dataToStore);

    spyOn(localStorage, 'getItem').and.returnValue(dataToStoreString);

    const result = component.getTopMoviesFromLocalStorage(dataToStoreString);

    expect(result).toBeTrue();
  });

  it('should return false on invalid data', () => {
    const data = [{ id: 1, title: 'test' }] as Movie[];

    const dataInLocalStorage = {
      timestamp: Date.now() - 20 * 60 * 60 * 1000,
      data: data,
    };
    const dataInLocalStorageString = JSON.stringify(dataInLocalStorage);

    spyOn(localStorage, 'getItem').and.returnValue(dataInLocalStorageString);

    const result = component.getTopMoviesFromLocalStorage(
      dataInLocalStorageString
    );

    expect(result).toBeFalse();
  });
});
