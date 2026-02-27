// App_MAIN_ts-main\src\app\models\movie-detail.model.ts
export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
  tagline: string | null;
    createdAt: string; // ISO string

}
