import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import CustomList from '../components/CustomList';
import {
    Container,
    Box,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';

const DashboardPage = () => {
    const { user, isAuthenticated } = useAuth0();
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [role, setRole] = useState('');

    useEffect(() => {
        if (!isAuthenticated || !user) {
            return;
        }

        let userCreated = false;
        const fetchUserInfo = async () => {
            try {
                const accessToken = process.env.REACT_APP_ACCESS_TOKEN;
                const response = await fetch(
                    `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${user.sub}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const userRawJSON = await response.json();
                const userRole = userRawJSON.app_metadata?.role || 'user';
                setRole(userRole);

                if (userRawJSON.logins_count === 1) {
                    try {
                        const existingUser = await api.getUser(user.sub);
                        if (!existingUser && !userCreated) {
                            await api.createUser({
                                sub: user.sub,
                                name: user.name,
                                email: user.email,
                                role: userRole,
                            });
                        }
                        userCreated = true;
                    } catch (err) {
                        setError('Error creating user in database.');
                        console.error(err);
                    } finally {
                        setLoading(false);
                    }
                } else {
                    const userProjects = await api.getUserProjects(user.sub);
                    setProjects(userProjects);
                    const userTeams = await api.getUserTeams(user.sub);
                    setTeams(userTeams);
                    setLoading(false);
                }
            } catch (error) {
                setError('Error fetching user information.');
                console.error('Error fetching app_metadata:', error.message);
            }
        };

        fetchUserInfo();
    }, [user, isAuthenticated]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: 'background.default',
                color: 'primary.main',
            }}
        >
            <Navbar user={user} />
            <Container sx={{ mt: 4 }}>
                <Box>
                    <Tabs
                        value={currentTab}
                        onChange={(e, newValue) => setCurrentTab(newValue)}
                        indicatorColor="secondary"
                        textColor="secondary"
                        centered
                    >
                        <Tab label="Projects" />
                        <Tab label="Teams" />
                    </Tabs>
                    {currentTab === 0 && (
                        <CustomList
                            type="project"
                            items={projects}
                            role={role} // Pasar el rol al componente CustomList
                        />
                    )}
                    {currentTab === 1 && (
                        <CustomList
                            type="team"
                            items={teams}
                            role={role} // Pasar el rol al componente CustomList
                        />
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardPage;
