import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movies.service';
import { Title } from '@angular/platform-browser';

export enum MovieRating {
  HIGH = 'green',
  MEDIUM = 'orange',
  LOW = 'red',
}

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  private currentLanguage = localStorage.getItem('currentLanguage') || 'en';
  movieDetails: Movie = {
    genres: [],
    id: 0,
    overview: '',
    release_date: '',
    vote_average: 0,
    vote_count: 0,
    title: '',
    poster_path: '',
  };

  private movieId: string = '';
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage = event.lang;
      this.getMovieDetails();
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.movieId = params['id'];
      this.getMovieDetails();
    });
  }

  getMovieDetails(): void {
    const spinnerTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);

    if (this.movieId != '') {
      this.movieService
        .getMovieDetails(this.movieId, this.currentLanguage)
        .subscribe(
          (data) => {
            this.movieDetails = data;
            clearTimeout(spinnerTimeout);
            this.isLoading = false;
            this.titleService.setTitle(
              this.movieDetails.title || 'Movie Details'
            );
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
  ngOnDestroy() {
    this.titleService.setTitle(`Movie App`);
  }
}
