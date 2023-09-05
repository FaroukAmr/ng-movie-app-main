import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Movie } from '../models/movie.model';
import { MovieService } from '../home/movies.service';

export enum MovieRating {
  HIGH = 'green',
  MEDIUM = 'yellow',
  LOW = 'red',
}

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movieDetails: Movie = {
    genres: [],
    id: 0,
    overview: '',
    release_date: '',
    vote_average: 0,
    vote_count: 0,
  };

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

  getMovieDetails(movieId: string): void {
    const spinnerTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);

    if (movieId) {
      this.movieService.getMovieDetails(movieId).subscribe(
        (data) => {
          this.movieDetails = data;
          clearTimeout(spinnerTimeout);
          this.isLoading = false;
          console.log('Movie details:', data);
        },
        (error) => {
          console.error(error);
          clearTimeout(spinnerTimeout);
          this.isLoading = false;
        }
      );
    }
  }

  getColorForRating(voteAverage: number): string {
    if (voteAverage >= 7) {
      return MovieRating.HIGH;
    }
    if (voteAverage >= 4) {
      return MovieRating.MEDIUM;
    }
    return MovieRating.LOW;
  }
}
