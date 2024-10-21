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
import socket from '../utils/socket';

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
            console.log(teamData);
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

    // WebSocket para escuchar eventos relacionados con equipos
    useEffect(() => {
        // Listener para nuevo equipo
        socket.on('newTeam', (newTeam) => {
            setTeams((prevTeams) => [...prevTeams, newTeam]);
        });

        // Listener para equipo actualizado
        socket.on('updateTeam', (updatedTeam) => {
            setTeams((prevTeams) =>
                prevTeams.map((team) =>
                    team.id === updatedTeam.id ? updatedTeam : team
                )
            );
        });

        // Listener para equipo eliminado
        socket.on('deleteTeam', (deletedTeam) => {
            setTeams((prevTeams) =>
                prevTeams.filter((team) => team.id !== deletedTeam.id)
            );
        });

        // Cleanup: eliminar los listeners al desmontar el componente
        return () => {
            socket.off('newTeam');
            socket.off('updateTeam');
            socket.off('deleteTeam');
        };
    }, [teams]);

    // WebSocket para escuchar eventos relacionados con proyectos
    useEffect(() => {
        // Listener para nuevo proyecto
        socket.on('newProject', (newProject) => {
            setProjects((prevProjects) => [...prevProjects, newProject]);
        });

        // Listener para proyecto actualizado
        socket.on('updateProject', (updatedProject) => {
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            );
        });

        // Listener para proyecto eliminado
        socket.on('deleteProject', (deletedProject) => {
            setProjects((prevProjects) =>
                prevProjects.filter(
                    (project) => project.id !== deletedProject.id
                )
            );
        });

        // Cleanup: eliminar los listeners al desmontar el componente
        return () => {
            socket.off('newProject');
            socket.off('updateProject');
            socket.off('deleteProject');
        };
    }, [projects]);

    // Mostrar spinner de carga mientras se obtienen los datos
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
                            role={role}
                            onCreate={handleCreateProject}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
                            type="Project"
                            items={projects}
                            emptyMessage="No assigned projects."
                        />
                    )}
                    {currentTab === 1 && (
                        <CustomList
                            role={role}
                            onCreate={handleCreateTeam}
                            onEdit={handleEditTeam}
                            onDelete={handleDeleteTeam}
                            type="Team"
                            items={teams}
                            emptyMessage="No assigned teams."
                        />
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardPage;
