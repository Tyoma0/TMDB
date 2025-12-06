import { useGetFavoritesQuery,  } from "../../sevices/KinopoiskApi";
import {
    Typography,
    Box,
    Container,
    CircularProgress
} from "@mui/material";
import { MovieCard } from "../../components/movieCard/MovieCard";
import type { Movie,FavoriteMovie } from "../../types/api";

export function Favorites() {
    const { data: favorites, isLoading, error } = useGetFavoritesQuery();

    // Функция преобразования FavoriteMovie в Movie
    const convertToMovie = (favorite: FavoriteMovie): Movie => ({
        id: favorite.id,
        title: favorite.title,
        poster_path: favorite.poster_path,
        vote_average: favorite.vote_average,
        release_date: favorite.release_date || null, // Значение по умолчанию
        backdrop_path: favorite.backdrop_path || null, // Значение по умолчанию
        overview: favorite.overview || "",
        vote_count: favorite.vote_count || 0,
        adult: favorite.adult || false,
        genre_ids: favorite.genre_ids || [],
        original_language: favorite.original_language || "en",
        original_title: favorite.original_title || favorite.title,
        popularity: favorite.popularity || 0,
        video: favorite.video || false,
    });

    if (isLoading) {
        return (
            <Container sx={{ padding: "40px 20px", textAlign: "center" }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6">Загрузка избранных фильмов...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ padding: "40px 20px", textAlign: "center" }}>
                <Typography variant="h5" color="error">
                    Ошибка загрузки избранных фильмов
                </Typography>
            </Container>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <Container sx={{ padding: "40px 20px", textAlign: "center" }}>
                <Typography variant="h3" gutterBottom>
                    Любимые фильмы
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ marginTop: "20px" }}>
                    У вас пока нет избранных фильмов. Добавьте их ❤️
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ padding: "20px" }}>
            <Typography
                variant="h3"
                sx={{ marginBottom: "30px", textAlign: "center" }}
            >
                Любимые фильмы ({favorites.length})
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 3,
                    justifyContent: "center",
                }}
            >
                {favorites.map((film: FavoriteMovie) => (
                    <MovieCard key={film.id} movie={convertToMovie(film)} />
                ))}
            </Box>
        </Container>
    );
}