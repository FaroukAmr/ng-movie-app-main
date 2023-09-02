import { Component } from '@angular/core';
import { MovieService } from '../home/movies.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private movieService: MovieService,
    private searchService: SearchService
  ) {}

  topMovies: any;
  title: string = 'Top Rated Movies';

  ngOnInit() {
    this.getTopMoviesFromLocalStorage();
    this.searchService.searchQuery$.subscribe((query) => {
      this.handleSearch(query);
    });
  }

  getTopMoviesFromLocalStorage() {
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

  getTopMovies() {
    this.movieService.getTopMovies().subscribe((data) => {
      this.topMovies = data.results;
      this.storeDataToLocalStorage(data.results);
    });
  }

  storeDataToLocalStorage(data: any) {
    const dataToStore = {
      timestamp: Date.now(),
      data: data,
    };
    localStorage.setItem('topMoviesData', JSON.stringify(dataToStore));
  }

  handleSearch(query: string) {
    if (query === '') {
      this.title = 'Top Rated Movies';
      this.getTopMoviesFromLocalStorage();
      return;
    }
    this.movieService.searchMovies(query).subscribe((data) => {
      this.topMovies = data.results;
      this.title = 'Search Results';
    });
  }
}
