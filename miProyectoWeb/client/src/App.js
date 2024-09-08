// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth0ProviderWithHistory from './components/Auth/Auth0ProviderWithHistory';
import { ThemeProvider } from '@mui/material/styles';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import theme from './styles/theme';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import { GlobalStyles, CssBaseline } from '@mui/material';
import socket from './components/socket';

const scrollbarStyles = {
    '::-webkit-scrollbar': {
        width: '8px',
    },
    '::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
    },
    '::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '10px',
    },
    '::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555',
    },
};

const App = () => {
    socket.on('connect', () => {
        console.log('Conectado al servidor con ID:', socket.id);
    });
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={scrollbarStyles} />
            <Router>
                <Auth0ProviderWithHistory>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute component={DashboardPage} />
                            }
                        />
                        <Route
                            path="/dashboard/projects/:id"
                            element={<ProtectedRoute component={ProjectPage} />}
                        />
                        {/* <Route
                            path="*"
                            element={<ProtectedRoute component={LandingPage} />}
                        /> */}
                    </Routes>
                </Auth0ProviderWithHistory>
            </Router>
        </ThemeProvider>
    );
};

export default App;
