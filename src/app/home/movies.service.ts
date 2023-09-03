import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = environment.THEMOVIEDB_API_KEY;

  constructor(private http: HttpClient) {}

  getTopMovies(): Observable<any> {
    const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}`;
    return this.http.get(topRatedUrl);
  }

  searchMovies(query: string): Observable<any> {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${query}`;
    return this.http.get(searchUrl);
  }

  getMovieDetails(id: string): Observable<any> {
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`;
    return this.http.get(movieDetailsUrl);
  }
}
