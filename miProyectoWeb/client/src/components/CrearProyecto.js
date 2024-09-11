import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
} from '@mui/material';
import api from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';

const CrearProyecto = ({ open, onCreate, onClose }) => {
    const { user } = useAuth0();
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        teamId: null,
    });
    const [createdTeams, setCreatedTeams] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Obtén la lista de equipos desde tu API cuando se monte el componente
        const fetchTeams = async () => {
            try {
                const response = await api.getUserTeams(user.sub);
                setCreatedTeams(response || []);
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
            const payload = {
                name: projectData.name,
                description: projectData.description,
                userId: user.sub,
                teamId: projectData.teamId,
            };
            onCreate(payload);
            onClose();
        } catch (error) {
            console.error('Error al crear proyecto:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Project</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Project Name"
                        name="name"
                        sx={{ mt: 1 }}
                        value={projectData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={projectData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <Autocomplete
                        options={createdTeams || []}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        onChange={handleTeamChange}
                        renderOption={(props, option) => (
                            <li
                                {...props}
                                key={option.id}
                                style={{
                                    backgroundColor: '#f5f5f5', // Fondo ligero para más contraste
                                    color: '#333', // Color de texto
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        '#dcdcdc')
                                } // Hover más claro
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        '#f5f5f5')
                                } // Restaurar al fondo original
                            >
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Team"
                                variant="outlined"
                                fullWidth
                                required
                                error={!!errors.teamId}
                                helperText={errors.teamId}
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CrearProyecto;
