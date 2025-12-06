
import { Box, Typography } from "@mui/material"

export const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 2, bgcolor: 'grey.100', textAlign: 'center'}}>
            <Typography variant="body2" color="text.secondary">
                © 2025 Kinopoisk Demo · Data courtesy of TMDB.
            </Typography>
        </Box>
    )
}