export interface Movie {
  genres: {
    id: number;
    name: string;
  }[];
  id: number;

  overview: string;
  poster_path: string;

  release_date: string;

  title: string;
  vote_average: number;
  vote_count: number;
}

export interface StoredTopMoviesData {
  timestamp: number;
  data: Movie[];
}
