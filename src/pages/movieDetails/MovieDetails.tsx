import { useParams, useNavigate } from "react-router-dom";
import { useGetMovieDetailsQuery, useGetMovieCreditsQuery, useGetSimilarMoviesQuery } from "../../sevices/KinopoiskApi.ts";
import { useEffect } from "react";
import type { MovieDetails, CreditsResponse, MovieListResponse, Movie } from "../../types/api.ts";

export function MovieDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const movieId = Number(id);

    const { data: movieDetails, error: detailsError, isLoading: detailsLoading } = useGetMovieDetailsQuery(movieId);
    const { data: credits, error: creditsError, isLoading: creditsLoading } = useGetMovieCreditsQuery(movieId);
    const { data: similarMovies, error: similarError, isLoading: similarLoading } = useGetSimilarMoviesQuery(movieId);

    // Приводим типы
    const typedMovieDetails = movieDetails as MovieDetails | undefined;
    const typedCredits = credits as CreditsResponse | undefined;
    const typedSimilarMovies = similarMovies as MovieListResponse | undefined;

    // Прокрутка вверх при загрузке страницы
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (detailsLoading) return <div style={{ padding: "20px", textAlign: "center" }}>Loading movie details...</div>;
    if (detailsError) return <div style={{ padding: "20px", textAlign: "center" }}>Error loading movie details</div>;
    if (!typedMovieDetails) return <div style={{ padding: "20px", textAlign: "center" }}>Movie not found</div>;

    // Форматирование даты
    const releaseYear = typedMovieDetails.release_date ? new Date(typedMovieDetails.release_date).getFullYear() : 'N/A';

    // Форматирование продолжительности
    const formatRuntime = (minutes: number | null) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Топ-6 актеров
    const topCast = typedCredits?.cast?.slice(0, 6) || [];

    // Похожие фильмы (минимум 6)
    const similarFilms = typedSimilarMovies?.results?.slice(0, 6) || [];

    return (
        <div>
            <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                {/* Кнопка Назад */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: "10px 20px",
                        marginBottom: "20px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    ← Назад
                </button>

                {/* Блок 1: Информация о фильме */}
                <div style={{
                    display: "flex",
                    gap: "30px",
                    marginBottom: "40px",
                    flexWrap: "wrap"
                }}>
                    {/* Постер */}
                    <div style={{ flex: "0 0 300px" }}>
                        <img
                            src={typedMovieDetails.poster_path
                                ? `https://image.tmdb.org/t/p/w500${typedMovieDetails.poster_path}`
                                : 'https://placehold.co/500x750/333/white?text=No+Image'
                            }
                            alt={typedMovieDetails.title}
                            style={{
                                width: "100%",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
                            }}
                        />
                    </div>

                    {/* Информация */}
                    <div style={{ flex: "1", minWidth: "300px" }}>
                        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
                            {typedMovieDetails.title}
                        </h1>

                        <div style={{ marginBottom: "20px" }}>
                            <span style={{ fontSize: "1.2rem", color: "#666" }}>
                                {releaseYear} •
                                {typedMovieDetails.genres?.map((genre) => genre.name).join(', ')} •
                                {formatRuntime(typedMovieDetails.runtime)}
                            </span>
                        </div>

                        {/* Рейтинг */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.1)",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            marginBottom: "20px"
                        }}>
                            <span style={{
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: "#1976d2"
                            }}>
                                ⭐ {typedMovieDetails.vote_average?.toFixed(1)}/10
                            </span>
                            <span style={{ marginLeft: "8px", color: "#666" }}>
                                ({typedMovieDetails.vote_count} votes)
                            </span>
                        </div>

                        {/* Описание */}
                        <div style={{ marginBottom: "30px" }}>
                            <h3 style={{ marginBottom: "10px" }}>Overview</h3>
                            <p style={{
                                fontSize: "1.1rem",
                                lineHeight: "1.6",
                                color: "#333"
                            }}>
                                {typedMovieDetails.overview || "No description available."}
                            </p>
                        </div>

                        {/* Дополнительная информация */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                            <div>
                                <h4>Status</h4>
                                <p>{typedMovieDetails.status}</p>
                            </div>
                            <div>
                                <h4>Original Language</h4>
                                <p>{typedMovieDetails.original_language?.toUpperCase()}</p>
                            </div>
                            <div>
                                <h4>Budget</h4>
                                <p>${typedMovieDetails.budget?.toLocaleString() || 'N/A'}</p>
                            </div>
                            <div>
                                <h4>Revenue</h4>
                                <p>${typedMovieDetails.revenue?.toLocaleString() || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Блок 2: Актеры */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ marginBottom: "20px", borderBottom: "2px solid #1976d2", paddingBottom: "10px" }}>
                        Top Cast
                    </h2>

                    {creditsLoading ? (
                        <div>Loading cast...</div>
                    ) : creditsError ? (
                        <div>Error loading cast</div>
                    ) : topCast.length === 0 ? (
                        <div>No cast information available</div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "20px"
                        }}>
                            {topCast.map((actor) => (
                                <div key={actor.id} style={{ textAlign: "center" }}>
                                    <img
                                        src={actor.profile_path
                                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                            : 'https://placehold.co/200x300/eee/999?text=No+Photo'
                                        }
                                        alt={actor.name}
                                        style={{
                                            width: "100%",
                                            height: "300px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            marginBottom: "10px"
                                        }}
                                    />
                                    <div>
                                        <h4 style={{ margin: "5px 0", fontSize: "1rem" }}>
                                            {actor.name}
                                        </h4>
                                        <p style={{
                                            margin: 0,
                                            color: "#666",
                                            fontSize: "0.9rem",
                                            fontStyle: "italic"
                                        }}>
                                            {actor.character}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Блок 3: Похожие фильмы */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ marginBottom: "20px", borderBottom: "2px solid #1976d2", paddingBottom: "10px" }}>
                        Similar Movies
                    </h2>

                    {similarLoading ? (
                        <div>Loading similar movies...</div>
                    ) : similarError ? (
                        <div>Error loading similar movies</div>
                    ) : similarFilms.length === 0 ? (
                        <div>No similar movies found</div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "20px"
                        }}>
                            {similarFilms.map((movie: Movie) => (
                                <div
                                    key={movie.id}
                                    style={{
                                        cursor: "pointer",
                                        transition: "transform 0.2s"
                                    }}
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    <img
                                        src={movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : 'https://placehold.co/500x750/333/white?text=No+Image'
                                        }
                                        alt={movie.title}
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginBottom: "8px"
                                        }}
                                    />
                                    <h4 style={{
                                        textAlign: "center",
                                        fontSize: "14px",
                                        margin: 0,
                                        lineHeight: "1.3"
                                    }}>
                                        {movie.title}
                                    </h4>
                                    <p style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                        color: "#666",
                                        margin: "5px 0 0 0"
                                    }}>
                                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}