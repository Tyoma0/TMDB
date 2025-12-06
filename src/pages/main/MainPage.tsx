import {useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from './MainPage.module.css'
import { setQuery } from "../../features/currentQuerySlice.ts";

import {
    useGetNowPlayingQuery,
    useGetPopularFilmsQuery,
    useGetUpComingFilmsQuery,
    useGetRatedFilmsQuery
} from "../../sevices/KinopoiskApi.ts";

import { MovieBlock } from "./movieBlock/MovieBlock.tsx";
import type {AppDispatch, RootState} from "../../app/store.ts";
import type { MovieListResponse, Movie } from "../../types/api.ts";

function MainPage() {
    type FilmCategory = 'popular' | 'top_rated' | 'upcoming' | 'now_playing';

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Берём query из Redux
    const query = useSelector((state: RootState) => state.currentQuery.query);

    // Создаём randomPage один раз при первом рендере
    const randomPage = useMemo(() => Math.floor(Math.random() * 5) + 1, []);

    // Получаем данные с правильными типами
    const { data: popularData } = useGetPopularFilmsQuery(randomPage);
    const { data: ratedData } = useGetRatedFilmsQuery(randomPage);
    const { data: upcomingData } = useGetUpComingFilmsQuery(randomPage);
    const { data: nowPlayingData } = useGetNowPlayingQuery(randomPage);

    // Приводим типы
    const typedPopularData = popularData as MovieListResponse | undefined;
    const typedRatedData = ratedData as MovieListResponse | undefined;
    const typedUpcomingData = upcomingData as MovieListResponse | undefined;
    const typedNowPlayingData = nowPlayingData as MovieListResponse | undefined;

    // Мемоизация фильмов
    const bgFilm = useMemo(() => typedPopularData?.results[0], [typedPopularData]);
    const topFilms = useMemo(() => typedPopularData?.results.slice(0, 6) as Movie[], [typedPopularData]);
    const ratedFilms = useMemo(() => typedRatedData?.results.slice(0, 6) as Movie[], [typedRatedData]);
    const upcomingFilms = useMemo(() => typedUpcomingData?.results.slice(0, 6) as Movie[], [typedUpcomingData]);
    const nowPlayingFilms = useMemo(() => typedNowPlayingData?.results.slice(0, 6) as Movie[], [typedNowPlayingData]);

    const isSearchDisabled = !query.trim();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isSearchDisabled) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            dispatch(setQuery(""));
        }
    };

    const handleSearch = () => {
        const trimmed = query.trim();
        if (isSearchDisabled) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        dispatch(setQuery(""))
    };

    const handleShowMore = (category: FilmCategory) => {
        navigate(`/search?${category}=true`);
    };

    return (
        <div style={{ width: '100%', color: 'white' }}>

            {/* Блок с фоновой картинкой */}
            <div className={styles.BlockImg}
                 style={{
                     backgroundImage: bgFilm?.backdrop_path
                         ? `url(https://image.tmdb.org/t/p/original${bgFilm.backdrop_path})`
                         : 'none'
                 }}
            >
                <div className={styles.darkOverlay} />

                <div className={styles.bannerContent}>
                    <h1 className={styles.bannerTitle}>TMDB</h1>


                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Введите название фильма..."
                            value={query}
                            onChange={e => dispatch(setQuery(e.target.value))}
                            onKeyDown={handleKeyDown}
                            className={styles.searchInput}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearchDisabled}
                            className={styles.searchBtn}
                        >
                            Найти
                        </button>
                    </div>
                </div>
            </div>

            <MovieBlock title="Популярные фильмы" films={topFilms} category="popular" onShowMore={() => handleShowMore('popular')} />
            <MovieBlock title="Рейтинговые фильмы" films={ratedFilms} category="top_rated" onShowMore={() => handleShowMore('top_rated')} />
            <MovieBlock title="UpComing" films={upcomingFilms} category="upcoming" onShowMore={() => handleShowMore('upcoming')} />
            <MovieBlock title="Now Playing" films={nowPlayingFilms} category="now_playing" onShowMore={() => handleShowMore('now_playing')} />
        </div>
    );
}

export { MainPage };