import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Autocomplete } from '@mui/material';
import api from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';

const CrearProyecto = ({ onClose }) => {
    const { user } = useAuth0();
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        teamId: null,
    });
    const [createdTeams, setCreatedTeams] = useState([]);

    useEffect(() => {
        // Obtén la lista de equipos desde tu API cuando se monte el componente
        const fetchTeams = async () => {
            try {
                const response = await api.getUserCreatedTeams(user.sub);
                setCreatedTeams(response.data || []);
            } catch (error) {
                console.error('Error al obtener equipos:', error);
                setCreatedTeams([]);
            }
        };

        fetchTeams();
    }, [user.sub]);

    const handleChange = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTeamChange = (event, value) => {
        setProjectData({
            ...projectData,
            teamId: value ? value.id : null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...projectData,
                userId: user.sub,
            };
            await api.createProject(payload);
            onClose();
        } catch (error) {
            console.error('Error al crear proyecto:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <TextField
                label="Nombre del Proyecto"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Descripción"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
            />
            <Autocomplete
                options={createdTeams}
                getOptionLabel={(option) => option.name || ''}
                onChange={handleTeamChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Selecciona un equipo"
                        variant="outlined"
                        fullWidth
                    />
                )}
            />
            <Button type="submit" variant="contained" color="primary">
                Crear Proyecto
            </Button>
        </Box>
    );
};

export default CrearProyecto;
