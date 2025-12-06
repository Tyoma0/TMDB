import React from "react";
import {  Typography, Box, Button } from '@mui/material';
import type { Movie } from "../../../types/api.ts";
import {MovieCard} from "../../../components/movieCard/MovieCard.tsx";

type FilmCategory = 'popular' | 'top_rated' | 'upcoming' | 'now_playing';

type MovieBlockProps = {
    title: string;
    films?: Movie[];
    category: FilmCategory;
    onShowMore: (category: string) => void;
    isLoading?: boolean;
};

// Вспомогательные функции



export const MovieBlock: React.FC<MovieBlockProps> = ({
                                                          title,
                                                          films,
                                                          category,
                                                          onShowMore,
                                                          isLoading = false
                                                      }) => {


    if (isLoading) {
        return (
            <Box sx={{ padding: '40px 20px', width: '100%' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {[...Array(6)].map((_, index: number) => (
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
            </Box>
        );
    }

    if (!films || films.length === 0) {
        return null;
    }

    return (
        <Box sx={{ padding: '40px 20px', width: '100%' }}>
            <Typography variant="h4" component="h2" gutterBottom>
                {title}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}
            >
                {films.map((film) => (
                    <MovieCard key={film.id} movie={film} />
                ))}
            </Box>

            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                    variant="contained"
                    onClick={() => onShowMore(category)}
                    sx={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                    }}
                >
                    Показать больше
                </Button>
            </Box>
        </Box>
    );
};