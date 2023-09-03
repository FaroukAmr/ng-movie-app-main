import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { MovieService } from '../home/movies.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoading: boolean = false;
  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {}

  topMovies: any;
  title: string = 'Top Rated Movies';

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const movieId = params['id'];
      this.handleSearch(movieId);
    });
  }

  getTopMovies() {
    const storedData = localStorage.getItem('topMoviesData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const timestamp = parsedData.timestamp;
      const data = parsedData.data;
      if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
        this.topMovies = data;
      } else {
        this.getTopMovies();
      }
    } else {
      this.getTopMovies();
    }
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

  storeDataToLocalStorage(data: any) {
    const dataToStore = {
      timestamp: Date.now(),
      data: data,
    };
    localStorage.setItem('topMoviesData', JSON.stringify(dataToStore));
  }

  handleSearch(query: string) {
    const spinnerTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);

    if (query === '' || query == undefined) {
      this.title = 'Top Rated Movies';
      this.getTopMovies();
      clearTimeout(spinnerTimeout);
      this.isLoading = false;
      return;
    }
    this.movieService.searchMovies(query).subscribe(
      (data) => {
        this.topMovies = data.results;
        this.title = 'Search Results';
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

  handleViewMovieDetails(movieId: string) {
    this.router.navigate(['/movie', movieId]);
  }
}
