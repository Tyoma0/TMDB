import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useGetFilmsQuery,
    useGetNowPlayingQuery,
    useGetPopularFilmsQuery,
    useGetRatedFilmsQuery,
    useGetUpComingFilmsQuery
} from "../../sevices/KinopoiskApi.ts";
import { Typography, Box, Button, TextField } from '@mui/material';
import { MovieCard } from "../../components/movieCard/MovieCard.tsx";
import type { Movie, MovieListResponse } from "../../types/api.ts";

export function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const queryParam = searchParams.get("q") || "";
    const [inputValue, setInputValue] = useState(queryParam);

    const showPopular = searchParams.get("popular") === "true";
    const showTopRated = searchParams.get("top_rated") === "true";
    const showUpComing = searchParams.get("upcoming") === "true";
    const showNowPlaying = searchParams.get("now_playing") === "true";

    // Вызываем все хуки всегда, но настраиваем skip для ненужных
    const searchQuery = useGetFilmsQuery(
        { query: queryParam, page: 1 },
        {
            skip: !queryParam || showPopular || showTopRated || showUpComing || showNowPlaying
        }
    );

    const popularQuery = useGetPopularFilmsQuery(1, { skip: !showPopular });
    const nowPlayingQuery = useGetNowPlayingQuery(1, { skip: !showNowPlaying });
    const topRatedQuery = useGetRatedFilmsQuery(1, { skip: !showTopRated });
    const upcomingQuery = useGetUpComingFilmsQuery(1, { skip: !showUpComing });

    // Выбираем нужные данные и состояние загрузки/ошибки
    const { data, error, isLoading } = useMemo(() => {
        if (showPopular) return popularQuery;
        if (showNowPlaying) return nowPlayingQuery;
        if (showTopRated) return topRatedQuery;
        if (showUpComing) return upcomingQuery;
        return searchQuery;
    }, [
        showPopular, showNowPlaying, showTopRated, showUpComing,
        popularQuery, nowPlayingQuery, topRatedQuery, upcomingQuery, searchQuery
    ]);

    // Приводим данные к правильному типу
    const typedData = data as MovieListResponse | undefined;
    const films = typedData?.results || [];

    const isSearchDisabled = !inputValue.trim();

    const handleSearch = () => {
        const trimmed = inputValue.trim();
        if (isSearchDisabled) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isSearchDisabled) {
            handleSearch();
        }
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Box sx={{ marginBottom: "20px", display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    type="text"
                    placeholder="Введите название фильма"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    size="small"
                    sx={{ width: 400 }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={isSearchDisabled}
                >
                    Найти
                </Button>
            </Box>

            {!queryParam && !showPopular && !showTopRated && !showUpComing && !showNowPlaying && (
                <Typography>Enter a movie title to start searching</Typography>
            )}

            {isLoading ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {[...Array(8)].map((_, index) => (
                        <div key={index} style={{ width: '200px', textAlign: 'center' }}>
                            <div style={{
                                width: '100%',
                                height: '300px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                marginBottom: '8px'
                            }} />
                            <div style={{
                                height: '20px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                marginBottom: '4px'
                            }} />
                        </div>
                    ))}
                </Box>
            ) : error ? (
                <Typography color="error">Error: {String(error)}</Typography>
            ) : films.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: 3,
                        justifyContent: "center"
                    }}
                >
                    {films.map((film: Movie) => (
                        <MovieCard key={film.id} movie={film} />
                    ))}
                </Box>
            ) : (
                queryParam && <Typography>No matches found for "{queryParam}"</Typography>
            )}
        </Box>
    );
}