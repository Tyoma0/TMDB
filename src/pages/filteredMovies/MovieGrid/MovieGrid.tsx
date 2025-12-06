import { Grid, CircularProgress, Typography, Box } from "@mui/material";
import type {Movie} from "../../../types/api.ts";
import {MovieCard} from "../../../components/movieCard/MovieCard.tsx";


interface MovieGridProps {
    movies: Movie[];
    isLoading?: boolean;
    error?: unknown;
    emptyText?: string;
}

export function MovieGrid({ movies, isLoading, error, emptyText = "Фильмы не найдены" }: MovieGridProps) {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" textAlign="center" py={4}>
                Ошибка загрузки фильмов
            </Typography>
        );
    }

    if (!movies.length) {
        return (
            <Typography textAlign="center" py={4} color="text.secondary">
                {emptyText}
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            {movies.map((film) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={film.id}>
                    <MovieCard movie={film} />
                </Grid>
            ))}
        </Grid>
    );
}
