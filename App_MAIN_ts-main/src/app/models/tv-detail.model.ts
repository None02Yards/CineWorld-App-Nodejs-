export interface Genre {
  id: number;
  name: string;
}

export interface TvDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
  tagline: string | null;
}
