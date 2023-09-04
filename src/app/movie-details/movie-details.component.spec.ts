import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs'; // Import throwError

import { ActivatedRoute } from '@angular/router';
import { Movie } from '../models/movie.model';
import { MovieDetailsComponent } from './movie-details.component';
import { MovieService } from '../home/movies.service';

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let movieService: jasmine.SpyObj<MovieService>;
  const mockMovie: Movie = {
    genres: [],
    id: 123,
    overview: 'Testing',
    release_date: '2023-10-10',
    vote_average: 100,
    vote_count: 100,
  };

  const defaultMovie: Movie = {
    genres: [],
    id: 0,
    overview: '',
    release_date: '',
    vote_average: 0,
    vote_count: 0,
  };

  beforeEach(() => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', [
      'getMovieDetails',
    ]);

    TestBed.configureTestingModule({
      declarations: [MovieDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }), // Simulate ActivatedRoute params
          },
        },
        {
          provide: MovieService,
          useValue: movieServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoading to false', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should set movieDetails and isLoading when getMovieDetails is called successfully', () => {
    movieService.getMovieDetails.and.returnValue(of(mockMovie));
    component.getMovieDetails('1');
    expect(component.isLoading).toBe(false);
    expect(component.movieDetails).toEqual(mockMovie);
  });

  it('should handle errors when getMovieDetails fails', () => {
    const errorMessage = 'Error fetching movie details';
    movieService.getMovieDetails.and.returnValue(throwError(errorMessage));
    const consoleErrorSpy = spyOn(console, 'error');
    component.getMovieDetails('1');
    expect(component.isLoading).toBe(false);
    expect(component.movieDetails).toEqual(defaultMovie);
    expect(consoleErrorSpy).toHaveBeenCalledWith(errorMessage);
  });

  it('should return green color for voteAverage >= 7', () => {
    const color = component.getColorForRating(7.5);
    expect(color).toBe('green');
  });

  it('should return yellow color for 4 <= voteAverage < 7', () => {
    const color = component.getColorForRating(5.5);
    expect(color).toBe('yellow');
  });

  it('should return red color for voteAverage < 4', () => {
    const color = component.getColorForRating(3.5);
    expect(color).toBe('red');
  });

  it(`should call getMovieDetails when component is initialized`, () => {
    const spy = spyOn(component, 'getMovieDetails');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call getMovieDetails with the correct params value`, () => {
    const spy = spyOn(component, 'getMovieDetails');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it(`should destory setTimeOut when loading is done`, () => {
    const spy = spyOn(window, 'clearTimeout');
    movieService.getMovieDetails.and.returnValue(of(mockMovie));
    component.isLoading = false;
    component.getMovieDetails('1');
    expect(spy).toHaveBeenCalled();
  });
});
