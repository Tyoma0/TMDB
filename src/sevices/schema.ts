import { z } from "zod";

/* ✅ Схема фильма (базовая) */
export const MovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    poster_path: z.string().nullable(),
    vote_average: z.number(),
    release_date: z.string().nullable(),
    backdrop_path: z.string().nullable(),
});

/* ✅ Ответ списка фильмов */
export const MoviesListSchema = z.object({
    page: z.number(),
    results: z.array(MovieSchema),
    total_pages: z.number(),
});

/* ✅ Детали фильма */
export const MovieDetailsSchema = MovieSchema.extend({
    overview: z.string().nullable(),
    runtime: z.number().nullable(),
    genres: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        })
    ),
    backdrop_path: z.string().nullable(),
});

/* ✅ Актёры */
export const CreditsSchema = z.object({
    id: z.number(),
    cast: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            character: z.string().nullable(),
            profile_path: z.string().nullable(),
        })
    ),
    crew: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            job: z.string(),
            profile_path: z.string().nullable(),
        })
    ),
});

/* ✅ Жанры */
export const GenresSchema = z.object({
    genres: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        })
    ),
});
