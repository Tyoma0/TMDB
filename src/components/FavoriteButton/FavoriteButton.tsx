import { IconButton, Button, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useToggleFavoriteMutation, useIsFavoriteQuery } from '../../sevices/KinopoiskApi.ts';
import type { FavoriteMovie } from '../../sevices/KinopoiskApi.ts';

interface FavoriteButtonProps {
    movie: FavoriteMovie;
    variant?: 'icon' | 'text' | 'contained';
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'error';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
                                                                  movie,
                                                                  variant = 'icon',
                                                                  size = 'medium',
                                                                  color = 'error'
                                                              }) => {
    // Используем RTK Query для проверки статуса и переключения
    const { data: isFavorite, isLoading: isChecking } = useIsFavoriteQuery(movie.id);
    const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();

    const handleClick = async (e: React.MouseEvent): Promise<void> => {
        e.stopPropagation();

        if (isToggling) return;

        try {
            await toggleFavorite(movie).unwrap();
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const isLoading = isChecking || isToggling;

    // Вариант иконки (компактный)
    if (variant === 'icon') {
        return (
            <IconButton
                onClick={handleClick}
                color={color}
                size={size}
                disabled={isLoading}
                sx={{
                    backgroundColor: isFavorite ? 'rgba(211, 47, 47, 0.1)' : 'transparent',
                    '&:hover': {
                        backgroundColor: isFavorite ? 'rgba(211, 47, 47, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                        transform: isLoading ? 'scale(1)' : 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    opacity: isLoading ? 0.7 : 1,
                }}
            >
                {isLoading ? (
                    <CircularProgress size={20} />
                ) : isFavorite ? (
                    <FavoriteIcon />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>
        );
    }

    // Вариант с текстом
    const text = isFavorite ? 'В избранном' : 'В избранное';

    return (
        <Button
            variant={variant === 'contained' ? 'contained' : 'text'}
            onClick={handleClick}
            size={size}
            color={color}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : (isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />)}
            sx={{
                borderRadius: '20px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                    transform: variant === 'contained' && !isLoading ? 'scale(1.05)' : 'none',
                },
                transition: 'all 0.2s ease-in-out',
                opacity: isLoading ? 0.7 : 1,
            }}
        >
            {isLoading ? '...' : text}
        </Button>
    );
};