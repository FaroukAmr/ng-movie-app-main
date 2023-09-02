import { Component } from '@angular/core';
import { MOCK_MOVIES } from './mock-data';
import { MovieService } from '../home/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private movieService: MovieService) {}

  topMovies: any;

  ngOnInit() {
    // this.getTopMovies();
    this.topMovies = MOCK_MOVIES;
  }

  getTopMovies() {
    this.movieService.getTopMovies().subscribe((data) => {
      this.topMovies = data.results;
      console.log(data.results);
    });
  }
}
