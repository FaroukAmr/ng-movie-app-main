import { Component, OnDestroy } from '@angular/core';
import { Movie, StoredTopMoviesData } from '../models/movie.model';

import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../home/movies.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbar.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnDestroy {
  isLoading: boolean = false;
  isQuery: boolean = false;
  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private titleService: Title,
    private translateService: TranslateService
  ) {}

  topMovies: Movie[] = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('query');
      this.handleSearch(query);
    });
  }

  getTopMovies() {
    const storedData: string | null = localStorage.getItem('topMoviesData');
    if (storedData) {
      if (this.getTopMoviesFromLocalStorage(storedData)) {
        return;
      }
    }
    this.fetchTopMovies();
  }

  getTopMoviesFromLocalStorage(storedData: string): boolean {
    const parsedData: StoredTopMoviesData = JSON.parse(storedData);
    const timestamp = parsedData.timestamp;
    const data = parsedData.data;

    if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
      this.topMovies = data;
      return true;
    }
    return false;
  }

  fetchTopMovies() {
    this.movieService.getTopMovies().subscribe(
      (data) => {
        this.topMovies = data.results;
        this.storeDataToLocalStorage(data.results);
      },
      (error) => {
        this.snackbarService.showError(error.message);
      }
    );
  }

  storeDataToLocalStorage(data: Movie[]) {
    const dataToStore = {
      timestamp: Date.now(),
      data: data,
    };
    localStorage.setItem('topMoviesData', JSON.stringify(dataToStore));
  }

  handleSearch(query: string | null) {
    const spinnerTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    if (query === '' || query == undefined || query == null) {
      this.isQuery = false;
      this.titleService.setTitle(`Top Movies`);
      this.getTopMovies();
      clearTimeout(spinnerTimeout);
      this.isLoading = false;
      return;
    }

    this.isQuery = true;
    this.movieService.searchMovies(query).subscribe(
      (data) => {
        this.topMovies = data.results;

        this.titleService.setTitle(`Search Results for "${query}"`);

        clearTimeout(spinnerTimeout);
        this.isLoading = false;
      },
      (error) => {
        clearTimeout(spinnerTimeout);
        this.isLoading = false;
        this.snackbarService.showError(error.message);
      }
    );
  }

  handleViewMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  ngOnDestroy() {
    this.titleService.setTitle(`Movie App`);
  }
}
