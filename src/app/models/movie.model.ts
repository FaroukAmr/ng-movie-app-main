export interface Movie {
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
  genres: {
    id: number;
    name: string;
  }[];
}

export interface StoredTopMoviesData {
  timestamp: number;
  data: Movie[];
}
