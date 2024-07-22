import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth0ProviderWithHistory from './components/Auth/Auth0ProviderWithHistory';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import LandingPage from './components/Home/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectDetail from './components/Dashboard/ProjectDetail';
import TaskDetail from './components/Dashboard/TaskDetail';
import ChatDetail from './components/Dashboard/ChatDetail';
import './App.css';

const App = () => {
    return (
        <Router>
            <Auth0ProviderWithHistory>
                <Navbar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute component={Dashboard} />}
                    />
                    <Route
                        path="/projects/:id"
                        element={<ProtectedRoute component={ProjectDetail} />}
                    />
                    <Route
                        path="/tasks/:id"
                        element={<ProtectedRoute component={TaskDetail} />}
                    />
                    <Route
                        path="/chats/:id"
                        element={<ProtectedRoute component={ChatDetail} />}
                    />
                </Routes>
            </Auth0ProviderWithHistory>
        </Router>
    );
};

export default App;
