import { ActivatedRoute, Params } from '@angular/router';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { MovieDetailsComponent, MovieRating } from './movie-details.component';

import { MovieService } from '../home/movies.service';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;

  const activatedRouteMock = {
    params: of({ id: '1' } as Params),
  };

  const translateServiceMock = {
    onLangChange: of({ lang: 'en' } as LangChangeEvent),
  };

  const titleServiceMock = {
    setTitle: jasmine.createSpy('setTitle'),
  };

  const movieServiceMock = {
    getMovieDetails: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieDetailsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: Title, useValue: titleServiceMock },
        { provide: MovieService, useValue: movieServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMovieDetails on ngOnInit', () => {
    spyOn(component, 'getMovieDetails');

    component.ngOnInit();

    expect(component.getMovieDetails).toHaveBeenCalled();
  });

  it('should set the title on ngOnInit', () => {
    const movieTitle = 'Movie Title';
    spyOn(movieServiceMock, 'getMovieDetails').and.returnValue(
      of({ title: movieTitle })
    );

    component.ngOnInit();

    expect(titleServiceMock.setTitle).toHaveBeenCalledWith(movieTitle);
  });

  it('should set isLoading to true after 100ms', fakeAsync(() => {
    spyOn(movieServiceMock, 'getMovieDetails').and.returnValue(of({}));
    component.isLoading = false;

    component.getMovieDetails();

    expect(component.isLoading).toBe(false);
    tick(110);
    expect(component.isLoading).toBe(true);
  }));

  it('should set isLoading to false when getMovieDetails successfully fetches data', () => {
    spyOn(movieServiceMock, 'getMovieDetails').and.returnValue(of({}));

    component.getMovieDetails();

    expect(component.isLoading).toBeFalsy();
  });

  it('should set isLoading to false when getMovieDetails encounters an error', () => {
    spyOn(movieServiceMock, 'getMovieDetails').and.returnValue(of({}));

    component.getMovieDetails();

    expect(component.isLoading).toBeFalsy();
  });

  it('should return the correct color for a high vote average', () => {
    const highVoteAverage = 8.5;
    const color = component.getColorForRating(highVoteAverage);
    expect(color).toEqual(MovieRating.HIGH);
  });

  it('should return the correct color for a medium vote average', () => {
    const mediumVoteAverage = 5.5;
    const color = component.getColorForRating(mediumVoteAverage);
    expect(color).toEqual(MovieRating.MEDIUM);
  });

  it('should return the correct color for a low vote average', () => {
    const lowVoteAverage = 2.5;
    const color = component.getColorForRating(lowVoteAverage);
    expect(color).toEqual(MovieRating.LOW);
  });

  it('should not call movie service getMovieDetails if movieId is empty', () => {
    const movieServiceSpy = spyOn(movieServiceMock, 'getMovieDetails');
    component['movieId'] = '';
    component.getMovieDetails();
    expect(movieServiceSpy).not.toHaveBeenCalled();
  });
});
