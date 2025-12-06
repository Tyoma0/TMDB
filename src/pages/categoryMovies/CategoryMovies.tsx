import styles from './categoryMovies.module.css';
import { type ChangeEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setCategory, setPage } from "../../features/CategorySlice.ts";

import {
    useGetPopularFilmsQuery,
    useGetRatedFilmsQuery,
    useGetUpComingFilmsQuery,
    useGetNowPlayingQuery
} from "../../sevices/KinopoiskApi.ts";

import Pagination from "@mui/material/Pagination";
import type { AppDispatch, RootState } from "../../app/store.ts";

import type { Movie, MovieListResponse } from "../../types/api.ts";
import { Box } from "@mui/material";
import { MovieCard } from "../../components/movieCard/MovieCard.tsx";

type Category = "popular" | "top_rated" | "upcoming" | "now_playing";

export function CategoryMovies() {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const { category: currentCategory, page } = useSelector(
        (state: RootState) => state.category
    );

    // Синхронизация с URL параметрами
    useEffect(() => {
        const urlCategory = searchParams.get("type") as Category | null;
        if (urlCategory && urlCategory !== currentCategory) {
            dispatch(setCategory(urlCategory));
        } else if (!urlCategory) {
            setSearchParams({ type: currentCategory });
        }
    }, [searchParams, currentCategory, dispatch, setSearchParams]);

    // Запрашиваем данные по категории и странице
    const popularQuery = useGetPopularFilmsQuery(page);
    const topRatedQuery = useGetRatedFilmsQuery(page);
    const upcomingQuery = useGetUpComingFilmsQuery(page);
    const nowPlayingQuery = useGetNowPlayingQuery(page);

    const queriesMap: Record<Category, typeof popularQuery> = {
        popular: popularQuery,
        top_rated: topRatedQuery,
        upcoming: upcomingQuery,
        now_playing: nowPlayingQuery,
    };

    const { data, isLoading, error } = queriesMap[currentCategory as Category] || queriesMap.popular;

    const handleCategoryChange = (category: Category): void => {
        dispatch(setCategory(category));
        setSearchParams({ type: category });
    };

    const handlePageChange = (_: ChangeEvent<unknown>, value: number): void => {
        dispatch(setPage(value));
    };

    const categories: Category[] = ["popular", "top_rated", "upcoming", "now_playing"];

    // Приводим data к правильному типу
    const typedData = data as MovieListResponse | undefined;

    // Функция для отображения ошибки
    const renderError = () => {
        if (error) {
            return <p>Error loading data</p>;
        }
        return null;
    };

    return (
        <div style={{ color: "white", padding: "20px" }}>
            <h1>Movies Category Page</h1>

            {/* Кнопки категорий */}
            <div className={styles.divButton}>
                {categories.map((category: Category) => (
                    <button
                        className={`${styles.buttonCategory} ${category === currentCategory ? styles.active : ""}`}
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {category.replace("_", " ").toUpperCase()}
                    </button>
                ))}
            </div>

            <h2 style={{ marginBottom: "20px" }}>
                {currentCategory.replace("_", " ").toUpperCase()}
            </h2>

            {isLoading && <p>Loading...</p>}
            {renderError()}

            {typedData && typedData.results && typedData.results.length > 0 && (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: 3,
                        justifyContent: "center"
                    }}
                >
                    {typedData.results.map((film: Movie) => (
                        <MovieCard key={film.id} movie={film} />
                    ))}
                </Box>
            )}

            {typedData?.results?.length === 0 && !isLoading && (
                <p>No movies found</p>
            )}

            {/* Пагинация */}
            {typedData?.total_pages && typedData.total_pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <Pagination
                        count={typedData.total_pages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        siblingCount={1}
                        boundaryCount={1}
                    />
                </div>
            )}
        </div>
    );
}