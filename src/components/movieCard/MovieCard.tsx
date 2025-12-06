import { Card, CardMedia, Typography, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import type { Movie } from "../../types/api";
import styles from "./MovieCard.module.css";

export function MovieCard({ movie }: { movie: Movie }) {
    const navigate = useNavigate();

    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/500x750/333/white?text=No+Image";

    const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

    const handleOpen = () => navigate(`/movie/${movie.id}`);

    return (
        <Card className={styles.card} onClick={handleOpen}>
            <Box sx={{ position: "relative", height: "100%" }}>
                <CardMedia
                    component="img"
                    image={poster}
                    alt={movie.title}
                    sx={{ height: "100%", objectFit: "cover" }}
                />

                <div className={styles.posterDark} />

                <div
                    className={styles.favBtn}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FavoriteButton
                        movie={{
                            id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path || "",
                            vote_average: movie.vote_average
                        }}
                        variant="icon"
                        size="small"
                    />
                </div>

                <div className={styles.rating}>
                    <Typography sx={{ color: "white", fontWeight: 700 }}>
                        ⭐ {movie.vote_average.toFixed(1)}
                    </Typography>
                </div>

                <div className={styles.year}>
                    <Typography sx={{ color: "white", fontWeight: 600 }}>
                        {year}
                    </Typography>
                </div>

                <div className={styles.titleBox}>
                    <Tooltip title={movie.title}>
                        <Typography
                            sx={{
                                color: "white",
                                fontWeight: 700,
                                fontSize: "1rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                            }}
                        >
                            {movie.title}
                        </Typography>
                    </Tooltip>
                </div>
            </Box>
        </Card>
    );
}
