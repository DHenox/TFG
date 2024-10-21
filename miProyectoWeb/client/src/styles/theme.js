// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#e5e5e5',
        },
        secondary: {
            main: '#3cf6bb',
        },
        background: {
            default: '#1c1f24',
            paper: '#2d2d2d', // Color para papel/tarjetas
            hover: '#3d3d3d', // Color para papel/tarjetas
        },
        text: {
            primary: '#e5e5e5',
            secondary: '#b0b0b0', // Color de texto secundario
            tertiary: '#8a8a8a', // Color de texto
        },
        error: {
            main: '#d32f2f', // Color de error
        },
        warning: {
            main: '#f57c00', // Color de advertencia
        },
        success: {
            main: '#388e3c', // Color de éxito
        },
        info: {
            main: '#0288d1', // Color de información
        },
        scanning: {
            main: '#ff9800', // Color de escaneo
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default theme;
