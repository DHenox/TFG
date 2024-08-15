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

const App = () => {
    return (
        <ThemeProvider theme={theme}>
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
