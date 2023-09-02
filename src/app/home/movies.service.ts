import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = environment.THEMOVIEDB_API_KEY;
  private apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  getTopMovies(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
