import { useSelector, useDispatch } from 'react-redux';
import { useGetDiscoverMoviesQuery, useGetGenresQuery } from '../../sevices/KinopoiskApi.ts';

import {
    setSortBy,
    setVoteRange,
    toggleGenre,
    removeGenre,
    setPage,
    resetFilters,
} from '../../features/filterSlice.ts';
import { useDebouncedFilter } from '../../hooks/useDebouncedFilter.ts';
import {
    Box,
    Container,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Chip,
    Button,
    Pagination,
    CircularProgress,
    Alert,
    Paper,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { RootState, AppDispatch } from '../../app/store.ts';
import type { SortOption } from '../../features/filterSlice.ts';
import type { Genre, Movie, MovieListResponse, GenresResponse } from '../../types/api.ts';
import {MovieGrid} from "./MovieGrid/MovieGrid.tsx";

const FilterPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: 'fit-content',
    position: 'sticky',
    top: 20,
}));

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popularity.desc', label: 'Популярности (убывание)' },
    { value: 'popularity.asc', label: 'Популярности (возрастание)' },
    { value: 'vote_average.desc', label: 'Рейтингу (убывание)' },
    { value: 'vote_average.asc', label: 'Рейтингу (возрастание)' },
    { value: 'release_date.desc', label: 'Дате выпуска (убывание)' },
    { value: 'release_date.asc', label: 'Дате выпуска (возрастание)' },
    { value: 'title.asc', label: 'Названию (А-Я)' },
    { value: 'title.desc', label: 'Названию (Я-А)' },
];

export function FilteredMovies() {
    const dispatch = useDispatch<AppDispatch>();

    // Получаем состояние из Redux
    const filters = useSelector((state: RootState) => state.filters);
    const { data: genresData } = useGetGenresQuery('');

    // Используем debounce хук
    useDebouncedFilter();

    // Запрос фильмов с текущими фильтрами
    const { data: moviesData,  isLoading } = useGetDiscoverMoviesQuery({
        sort_by: filters.sort_by,
        vote_gte: filters.debouncedVote.gte,
        vote_lte: filters.debouncedVote.lte,
        genres: filters.genres,
        page: filters.page,
    });

    // Обработчики
    const handleSortChange = (value: SortOption): void => {
        dispatch(setSortBy(value));
    };

    const handleVoteChange = (_: Event, newValue: number | number[]): void => {
        const [gte, lte] = newValue as number[];
        dispatch(setVoteRange({ gte, lte }));
    };

    const handleGenreToggle = (genreId: number): void => {
        dispatch(toggleGenre(genreId));
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number): void => {
        dispatch(setPage(value));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleResetFilters = (): void => {
        dispatch(resetFilters());
    };

    const handleRemoveGenre = (genreId: number): void => {
        dispatch(removeGenre(genreId));
    };

    // Приводим типы
    const typedMoviesData = moviesData as MovieListResponse | undefined;
    const typedGenresData = genresData as GenresResponse | undefined;

    const movies: Movie[] = typedMoviesData?.results || [];
    const totalPages = Math.min(typedMoviesData?.total_pages || 1, 500);
    const totalResults = typedMoviesData?.total_results || 0;
    const genres: Genre[] = typedGenresData?.genres || [];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center">
                Фильтрация и сортировка фильмов
            </Typography>

            <Grid container spacing={3}>
                {/* Блок фильтров */}
                <Grid item xs={12} md={3}>
                    <FilterPaper elevation={3}>
                        <Typography variant="h5" gutterBottom>
                            Фильтры и сортировка
                        </Typography>

                        {/* Сортировка */}
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Сортировка</InputLabel>
                            <Select
                                value={filters.sort_by}
                                label="Сортировка"
                                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        {/* Фильтр по рейтингу */}
                        <Typography variant="h6" gutterBottom>
                            Рейтинг: {filters.vote_gte} - {filters.vote_lte}
                        </Typography>
                        <Slider
                            value={[filters.vote_gte, filters.vote_lte]}
                            onChange={handleVoteChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={10}
                            step={0.1}
                            sx={{ mb: 3 }}
                        />

                        <Divider sx={{ my: 2 }} />

                        {/* Фильтр по жанрам */}
                        <Typography variant="h6" gutterBottom>
                            Жанры
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            {genres.map((genre) => (
                                <Chip
                                    key={genre.id}
                                    label={genre.name}
                                    onClick={() => handleGenreToggle(genre.id)}
                                    color={filters.genres.includes(genre.id) ? 'primary' : 'default'}
                                    variant={filters.genres.includes(genre.id) ? 'filled' : 'outlined'}
                                    sx={{ m: 0.5 }}
                                    clickable
                                />
                            ))}
                        </Box>

                        {/* Выбранные жанры */}
                        {filters.genres.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Выбрано:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {filters.genres.map((genreId) => {
                                        const genre = genres.find((g) => g.id === genreId);
                                        return genre ? (
                                            <Chip
                                                key={genreId}
                                                label={genre.name}
                                                onDelete={() => handleRemoveGenre(genreId)}
                                                size="small"
                                                color="primary"
                                            />
                                        ) : null;
                                    })}
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Кнопка сброса */}
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleResetFilters}
                            fullWidth
                        >
                            Сбросить фильтры
                        </Button>

                        {/* Статистика */}
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Найдено фильмов: {totalResults}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Страница: {filters.page} из {totalPages}
                            </Typography>
                        </Box>
                    </FilterPaper>
                </Grid>

                {/* Блок результатов */}
                <Grid item xs={12} md={9}>


                    {filters.genres.length > 0 && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Выбрано жанров: {filters.genres.length}
                        </Alert>
                    )}

                    {/* Загрузка */}
                    {isLoading && (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* Результаты */}
                    {!isLoading && movies.length > 0 && (
                        <MovieGrid movies={movies} />
                    )}

                    {/* Пагинация */}
                    {totalPages > 1 && !isLoading && movies.length > 0 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={filters.page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}

                    {/* Сообщение о пустых результатах */}
                    {!isLoading && movies.length === 0 && (
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" color="text.secondary">
                                Фильмы не найдены. Попробуйте изменить фильтры.
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}