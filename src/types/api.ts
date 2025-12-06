// types/api.ts
export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_count: number;
    adult: boolean;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    popularity: number;
    video: boolean;
}

export interface MovieListResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface GenresResponse {
    genres: Genre[];
}

export interface FavoriteMovie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string | null; // Возможно оно опциональное?
    backdrop_path?: string | null;
    overview?: string;
    vote_count?: number;
    adult?: boolean;
    genre_ids?: number[];
    original_language?: string;
    original_title?: string;
    popularity?: number;
    video?: boolean;
}

export interface MovieDetails {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string | null;
    overview: string | null;
    runtime: number | null;
    genres: Genre[];
    backdrop_path: string | null;
    vote_count: number;
    status: string;
    original_language: string;
    budget: number | null;
    revenue: number | null;
}

export interface Actor {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface CreditsResponse {
    cast: Actor[];
}

export interface DiscoverParams {
    sort_by: string;
    vote_gte: number;
    vote_lte: number;
    genres: number[];
    page: number;
}