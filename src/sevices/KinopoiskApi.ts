import { createApi  } from "@reduxjs/toolkit/query/react";
import {
    MoviesListSchema,
    MovieDetailsSchema,
    CreditsSchema,
    GenresSchema,
} from "./schema";
import {customBaseQuery} from "./customBaseQuery.ts";

const key = import.meta.env.VITE_KINOPOISK_KEY;

// Интерфейс для избранных фильмов
export interface FavoriteMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

export const KinopoiskApi = createApi({
    reducerPath: "kinopoiskApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Movies", "Favorites"],
    endpoints: (builder) => ({
        getFilms: builder.query({
            query: ({ query, page = 1 }) =>
                `search/movie?api_key=${key}&query=${encodeURIComponent(
                    query
                )}&include_adult=false&language=en-US&page=${page}`,
            transformResponse: (response) => MoviesListSchema.parse(response),
            providesTags: ["Movies"],
        }),

        getPopularFilms: builder.query({
            query: (page = 1) =>
                `movie/popular?api_key=${key}&language=en-US&page=${page}`,
            transformResponse: (response) => MoviesListSchema.parse(response),
            providesTags: ["Movies"],
        }),

        getRatedFilms: builder.query({
            query: (page = 1) =>
                `movie/top_rated?api_key=${key}&language=en-US&page=${page}`,
            transformResponse: (response) => MoviesListSchema.parse(response),
            providesTags: ["Movies"],
        }),

        getUpComingFilms: builder.query({
            query: (page = 1) =>
                `movie/upcoming?api_key=${key}&language=en-US&page=${page}`,
            transformResponse: (response) => MoviesListSchema.parse(response),
            providesTags: ["Movies"],
        }),

        getNowPlaying: builder.query({
            query: (page = 1) =>
                `movie/now_playing?api_key=${key}&language=en-US&page=${page}`,
            transformResponse: (response) => MoviesListSchema.parse(response),
            providesTags: ["Movies"],
        }),

        getMovieDetails: builder.query({
            query: (id: number) => `movie/${id}?api_key=${key}&language=en-US`,
            transformResponse: (response) => MovieDetailsSchema.parse(response),
            providesTags: (_result, _error, id) => [{ type: "Movies", id }],
        }),

        getMovieCredits: builder.query({
            query: (id: number) =>
                `movie/${id}/credits?api_key=${key}&language=en-US`,
            transformResponse: (response) => CreditsSchema.parse(response),
        }),

        getSimilarMovies: builder.query({
            query: (id: number) =>
                `movie/${id}/similar?api_key=${key}&language=en-US&page=1`,
            transformResponse: (response) => MoviesListSchema.parse(response),
        }),

        getGenres: builder.query({
            query: () => `genre/movie/list?api_key=${key}&language=en-US`,
            transformResponse: (response) => GenresSchema.parse(response),
        }),

        getDiscoverMovies: builder.query({
            query: ({ sort_by, vote_gte, vote_lte, genres, page }) => {
                const genreString = genres.join(",");
                return `discover/movie?api_key=${key}&sort_by=${sort_by}&vote_average.gte=${vote_gte}&vote_average.lte=${vote_lte}&with_genres=${genreString}&page=${page}`;
            },
            transformResponse: (response) => MoviesListSchema.parse(response),
            providesTags: ["Movies"],
        }),

        // ========== ИЗБРАННОЕ (локально, без изменений) ==========

        getFavorites: builder.query<FavoriteMovie[], void>({
            queryFn: async () => {
                try {
                    const saved = localStorage.getItem("favoriteMovies");
                    const favorites = saved ? JSON.parse(saved) : [];
                    return { data: favorites };
                } catch {
                    return {
                        error: { status: "CUSTOM_ERROR", error: "Failed to load favorites" },
                    };
                }
            },
            providesTags: ["Favorites"],
        }),

        addToFavorites: builder.mutation<void, FavoriteMovie>({
            queryFn: async (movie) => {
                try {
                    const saved = localStorage.getItem("favoriteMovies");
                    const favorites = saved ? JSON.parse(saved) : [];

                    if (!favorites.some((f: FavoriteMovie) => f.id === movie.id)) {
                        const updated = [...favorites, movie];
                        localStorage.setItem("favoriteMovies", JSON.stringify(updated));
                    }
                    return { data: undefined };
                } catch {
                    return {
                        error: { status: "CUSTOM_ERROR", error: "Failed to add to favorites" },
                    };
                }
            },
            invalidatesTags: ["Favorites"],
        }),

        removeFromFavorites: builder.mutation<void, number>({
            queryFn: async (movieId) => {
                try {
                    const saved = localStorage.getItem("favoriteMovies");
                    const favorites = saved ? JSON.parse(saved) : [];

                    const updated = favorites.filter((f: FavoriteMovie) => f.id !== movieId);
                    localStorage.setItem("favoriteMovies", JSON.stringify(updated));

                    return { data: undefined };
                } catch {
                    return {
                        error: { status: "CUSTOM_ERROR", error: "Failed to remove from favorites" },
                    };
                }
            },
            invalidatesTags: ["Favorites"],
        }),

        toggleFavorite: builder.mutation<boolean, FavoriteMovie>({
            queryFn: async (movie) => {
                try {
                    const saved = localStorage.getItem("favoriteMovies");
                    const favorites = saved ? JSON.parse(saved) : [];

                    const existingIndex = favorites.findIndex((f: FavoriteMovie) => f.id === movie.id);
                    let isFavorite = false;

                    if (existingIndex >= 0) {
                        favorites.splice(existingIndex, 1);
                        isFavorite = false;
                    } else {
                        favorites.push(movie);
                        isFavorite = true;
                    }

                    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
                    return { data: isFavorite };
                } catch {
                    return {
                        error: { status: "CUSTOM_ERROR", error: "Failed to toggle favorite" },
                    };
                }
            },
            invalidatesTags: ["Favorites"],
        }),

        isFavorite: builder.query<boolean, number>({
            queryFn: async (movieId) => {
                try {
                    const saved = localStorage.getItem("favoriteMovies");
                    const favorites = saved ? JSON.parse(saved) : [];
                    const isFavorite = favorites.some((f: FavoriteMovie) => f.id === movieId);
                    return { data: isFavorite };
                } catch {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: "Failed to check favorite status",
                        },
                    };
                }
            },
            providesTags: (_result, _error, movieId) => [{ type: "Favorites", id: movieId }],
        }),
    }),
});

export const {
    useGetGenresQuery,
    useGetDiscoverMoviesQuery,
    useGetFilmsQuery,
    useGetPopularFilmsQuery,
    useGetRatedFilmsQuery,
    useGetUpComingFilmsQuery,
    useGetNowPlayingQuery,
    useGetMovieCreditsQuery,
    useGetSimilarMoviesQuery,
    useGetMovieDetailsQuery,

    useGetFavoritesQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation,
    useToggleFavoriteMutation,
    useIsFavoriteQuery,
} = KinopoiskApi;
