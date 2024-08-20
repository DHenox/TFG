import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Container,
} from '@mui/material';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import ChatList from '../components/ChatList';
import ScanButton from '../components/ScanButton';

const ProjectPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.getProject(id);
                setProject(response);
                const tasks = await api.getProjectTasks(id);
                setTasks(tasks);
                const chats = await api.getProjectChats(id);
                setChats(chats);
                const allUsers = await api.getAllUsers();
                setUsers(allUsers);
            } catch (err) {
                setError('Failed to fetch project details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

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
            <Box mt={4}>
                <Alert severity="error">{error}</Alert>
            </Box>
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
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    {project.name}
                </Typography>
                <Typography variant="subtitle1" component="p" sx={{ mb: 4 }}>
                    {project.description}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <TaskList projectId={id} tasks={tasks} users={users} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <ChatList chats={chats} />
                        <ScanButton />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ProjectPage;
