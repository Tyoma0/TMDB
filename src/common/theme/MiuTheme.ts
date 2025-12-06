// theme/muiTheme.ts
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        text: {
            primary: "#ffffff", // чёрный текст
            secondary: "#333333",
        },
        primary: {
            main: "#1976d2",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#f5f5f5",
                    color: "#000",
                    transition: "all 0.3s ease",
                },
                h1: { color: "#000" },
                h2: { color: "#000" },
                h3: { color: "#000" },
                h4: { color: "#000" },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#0a1a33", // темно-синий
            paper: "#10284e",
        },
        text: {
            primary: "#ffffff",
            secondary: "#cccccc",
        },
        primary: {
            main: "#82b1ff",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#0a1a33",
                    color: "#fff",
                    transition: "all 0.3s ease",
                },
                // Добавляем эффект для всех заголовков
                h1: {
                    background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                },
                h2: {
                    background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                },
                h3: {
                    background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                },
                h4: {
                    background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                },

            },
        },
    },
});
