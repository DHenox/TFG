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
    Avatar,
    Chip,
} from '@mui/material';
import api from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';

const CrearEquipo = ({ open, onClose }) => {
    const { user } = useAuth0();
    const [teamData, setTeamData] = useState({
        name: '',
        description: '',
        members: [],
    });

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        // Obtener la lista de todos los usuarios desde la API cuando se crea el componente
        const fetchUsers = async () => {
            try {
                const response = await api.getAllUsers();
                setAllUsers(response || []);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                setAllUsers([]);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setTeamData({
            ...teamData,
            [e.target.name]: e.target.value,
        });
    };

    const handleMembersChange = (event, value) => {
        setTeamData({
            ...teamData,
            members: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...teamData,
                userId: user.sub,
            };
            await api.createTeam(payload);
            onClose();
        } catch (error) {
            console.error('Error al crear equipo:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Crear Equipo</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Nombre del Equipo"
                        name="name"
                        value={teamData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={teamData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                    />
                    <Autocomplete
                        multiple
                        options={allUsers || []}
                        getOptionLabel={(option) =>
                            option.nickname || option.name || ''
                        }
                        onChange={handleMembersChange}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                <Avatar
                                    src={option.picture}
                                    sx={{ marginRight: 2 }}
                                />
                                {option.nickname || option.name}
                            </li>
                        )}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({
                                    index,
                                }); // Extraer `key` de `getTagProps`
                                return (
                                    <Chip
                                        key={option.id} // Usa la `key` correcta aquí
                                        avatar={<Avatar src={option.picture} />}
                                        label={option.nickname || option.name}
                                        {...tagProps} // Propaga el resto de `tagProps` sin la `key`
                                    />
                                );
                            })
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecciona los miembros del equipo"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Crear
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CrearEquipo;
