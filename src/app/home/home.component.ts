import { Component, OnDestroy } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Movie, StoredTopMoviesData } from '../models/movie.model';

import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../home/movies.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbar.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnDestroy {
  isLoading: boolean = false;
  query: string = '';
  private currentLanguage = localStorage.getItem('currentLanguage') || 'en';
  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage = event.lang;
      if (this.query === '') {
        this.getTopMovies();
      } else {
        this.handleSearch();
      }
    });
  }

  topMovies: Movie[] = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const qP = params.get('query');
      this.query = qP ? qP : '';
      if (this.query === '') {
        this.getTopMovies();
      } else {
        this.handleSearch();
      }
    });
  }

  getTopMovies() {
    const storedData: string | null = localStorage.getItem(
      'topMoviesData-' + this.currentLanguage
    );
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
    this.movieService.getTopMovies(this.currentLanguage).subscribe(
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
    localStorage.setItem(
      'topMoviesData-' + this.currentLanguage,
      JSON.stringify(dataToStore)
    );
  }

  handleSearch() {
    const spinnerTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    if (this.query === '') {
      this.titleService.setTitle(`Top Movies`);
      this.getTopMovies();
      clearTimeout(spinnerTimeout);
      this.isLoading = false;
      return;
    }

    this.movieService.searchMovies(this.query, this.currentLanguage).subscribe(
      (data) => {
        this.topMovies = data.results;
        this.titleService.setTitle(`Search Results for "${this.query}"`);
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
