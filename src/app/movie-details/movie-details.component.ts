import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../home/movies.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movieDetails: any;
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const movieId = params['id'];
      this.getMovieDetails(movieId);
    });
  }

  getMovieDetails(movieId: string) {
    const spinnerTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);

    if (movieId) {
      this.movieService.getMovieDetails(movieId).subscribe(
        (data) => {
          this.movieDetails = data;
          clearTimeout(spinnerTimeout);
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching movie details:', error);
          clearTimeout(spinnerTimeout);
          this.isLoading = false;
        }
      );
    }
  }

  getColorForRating(voteAverage: number): string {
    if (voteAverage >= 7) {
      return 'green';
    } else if (voteAverage >= 4) {
      return 'yellow';
    } else {
      return 'red';
    }
  }
}
