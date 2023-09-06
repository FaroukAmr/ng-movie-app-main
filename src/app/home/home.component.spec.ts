import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { HomeComponent } from './home.component';
import { Movie } from '../models/movie.model';
import { MovieService } from '../home/movies.service';
import { SnackbarService } from '../snackbar.service';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const translateServiceMock = {
    onLangChange: of({ lang: 'en' } as LangChangeEvent),
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

  const movieServiceMock = {
    getTopMovies: () => of([]),
    searchMovies: (query: string, language: string) => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [TranslateModule.forRoot()],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should store top movies data in localStorage', () => {
    const data = [{ id: 1, title: 'test' }] as Movie[];
    const dataToStore = {
      timestamp: Date.now(),
      data: data,
    };
    const dataToStoreString = JSON.stringify(dataToStore);

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    component.storeDataToLocalStorage(data);
    component['currentLanguage'] = 'en';
    component.ngOnInit();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'topMoviesData-' + 'en',
      dataToStoreString
    );
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
