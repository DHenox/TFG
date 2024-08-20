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
    const [userCreated, setUserCreated] = useState(false); // Variable para evitar crear al usuario más de una vez
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [role, setRole] = useState('');

    const handleCreateProject = async (projectData) => {
        try {
            const newProject = await api.createProject(projectData);
            setProjects([...projects, newProject]);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleEditProject = async (projectId, projectData) => {
        try {
            const updatedProject = await api.updateProject(
                projectId,
                projectData
            );
            setProjects(
                projects.map((project) =>
                    project.id === projectId ? updatedProject : project
                )
            );
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await api.deleteProject(projectId);
            setProjects(projects.filter((project) => project.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleCreateTeam = async (teamData) => {
        try {
            const newTeam = await api.createTeam(teamData);
            setTeams([...teams, newTeam]);
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    const handleEditTeam = async (teamId, teamData) => {
        try {
            const updatedTeam = await api.updateTeam(teamId, teamData);
            setTeams(
                teams.map((team) => (team.id === teamId ? updatedTeam : team))
            );
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };

    const handleDeleteTeam = async (teamId) => {
        try {
            await api.deleteTeam(teamId);
            setTeams(teams.filter((team) => team.id !== teamId));
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !user) {
            return;
        }

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
                const userRole = userRawJSON.app_metadata?.role || 'pentester';
                setRole(userRole);

                const dbUser = await api.getUser(user.sub);
                if (userRawJSON.logins_count === 1) {
                    try {
                        if (!dbUser && !userCreated) {
                            await api.createUser({
                                sub: user.sub,
                                name: user.name,
                                email: user.email,
                                picture: user.picture,
                                role: userRole,
                            });
                            setUserCreated(true);
                        }
                    } catch (err) {
                        setError('Error creating user in database.');
                        console.error(err);
                    } finally {
                        setLoading(false);
                    }
                }
                try {
                    // Si hay datos diferentes en Auth0 y en la base de datos, actualizar la base de datos
                    if (
                        dbUser.name !== user.name ||
                        dbUser.email !== user.email ||
                        dbUser.picture !== user.picture ||
                        dbUser.role !== userRole
                    ) {
                        await api.updateUser(user.sub, {
                            name: user.name,
                            email: user.email,
                            picture: user.picture,
                            role: userRole,
                        });
                    }
                } catch (err) {
                    setError('Error updating user in database.');
                    console.error(err);
                }
                const userProjects = await api.getUserProjects(user.sub);
                setProjects(userProjects);
                const userTeams = await api.getUserTeams(user.sub);
                setTeams(userTeams);
                setLoading(false);
            } catch (error) {
                setError('Error fetching user information.');
                console.error('Error fetching app_metadata:', error.message);
            }
        };

        fetchUserInfo();
    }, [user, isAuthenticated, userCreated]);

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
                        <Tab label="Proyectos" />
                        <Tab label="Equipos" />
                    </Tabs>
                    {currentTab === 0 && (
                        <CustomList
                            role={role}
                            onCreate={handleCreateProject}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
                            type="Proyecto"
                            items={projects}
                            emptyMessage="No tienes proyectos asignados."
                        />
                    )}
                    {currentTab === 1 && (
                        <CustomList
                            role={role}
                            onCreate={handleCreateTeam}
                            onEdit={handleEditTeam}
                            onDelete={handleDeleteTeam}
                            type="Equipo"
                            items={teams}
                            emptyMessage="No formas parte de ningún equipo."
                        />
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardPage;
