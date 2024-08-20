import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Autocomplete,
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../utils/api';

const EditarProyecto = ({ item, open, onEdit, onClose }) => {
    const { user } = useAuth0();
    const [projectData, setProjectData] = useState({
        id: item.id,
        name: item.name,
        description: item.description,
        teamId: item.team_id,
    });
    const [createdTeams, setCreatedTeams] = useState([]);
    const [errors, setErrors] = useState({});

    // Update projectData when item changes
    useEffect(() => {
        setProjectData({
            id: item.id,
            name: item.name,
            description: item.description,
            teamId: item.team_id,
        });
    }, [item]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const responseCreatedTeams = await api.getUserCreatedTeams(
                    user.sub
                );
                setCreatedTeams(responseCreatedTeams || []);
            } catch (error) {
                console.error('Error al obtener equipos:', error);
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

        if (
            !projectData.name ||
            !projectData.description ||
            !projectData.teamId
        ) {
            setErrors({
                name: !projectData.name ? 'El nombre es obligatorio' : '',
                description: !projectData.description
                    ? 'La descripción es obligatoria'
                    : '',
                teamId: !projectData.teamId ? 'El equipo es obligatorio' : '',
            });
            return;
        }

        try {
            onEdit(projectData.id, projectData);
            onClose();
        } catch (error) {
            console.error('Error al editar proyecto:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar proyecto</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Nombre del proyecto"
                        name="name"
                        sx={{ mt: 1 }}
                        value={projectData.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={projectData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <Autocomplete
                        options={createdTeams || []}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        value={
                            createdTeams.find(
                                (team) => team.id === projectData.teamId
                            ) || null
                        }
                        onChange={handleTeamChange}
                        renderOption={(props, option) => (
                            <li
                                {...props}
                                key={option.id}
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        '#dcdcdc')
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        '#f5f5f5')
                                }
                            >
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecciona un equipo"
                                variant="outlined"
                                fullWidth
                                error={!!errors.teamId}
                                helperText={errors.teamId}
                            />
                        )}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Guardar cambios
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditarProyecto;
