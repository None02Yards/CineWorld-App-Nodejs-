export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface CreditResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}
