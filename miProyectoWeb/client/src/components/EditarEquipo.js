import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Autocomplete,
    Avatar,
    Chip,
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../utils/api';

const EditarEquipo = ({ item, open, onEdit, onClose }) => {
    const { user } = useAuth0();
    const [teamData, setTeamData] = useState({
        id: item.id,
        name: item.name,
        description: item.description,
        members: [],
    });
    const [allUsers, setAllUsers] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseAllUsers = await api.getAllUsers();
                setAllUsers(responseAllUsers || []);
                const response = await api.getTeamUsers(item.id);
                setTeamData((prevData) => ({
                    ...prevData,
                    members: response,
                }));
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        fetchUsers();
    }, [item.id]); // Solo se ejecuta cuando item.id cambia

    const handleChange = (e) => {
        setTeamData({ ...teamData, [e.target.name]: e.target.value });
    };

    const handleMembersChange = (event, value) => {
        setTeamData({ ...teamData, members: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamData.name || !teamData.description) {
            setErrors({
                name: !teamData.name ? 'El nombre es obligatorio' : '',
                description: !teamData.description
                    ? 'La descripción es obligatoria'
                    : '',
            });
            return;
        }

        try {
            // Comprobar todos los ids de los miembros y comprobar si el usuario actual está en la lista
            if (!teamData.members.some((member) => member.id === user.sub)) {
                teamData.members.push({ id: user.sub });
            }
            onEdit(item.id, teamData);
            onClose();
        } catch (error) {
            console.error('Error al editar equipo:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Equipo</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Nombre del Equipo"
                        name="name"
                        sx={{ mt: 1 }}
                        value={teamData.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={teamData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <Autocomplete
                        multiple
                        options={allUsers || []}
                        getOptionLabel={(option) =>
                            option.nickname || option.name
                        }
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        value={teamData.members}
                        onChange={handleMembersChange}
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
                                });
                                return (
                                    <Chip
                                        key={option.id}
                                        avatar={<Avatar src={option.picture} />}
                                        label={option.nickname || option.name}
                                        {...tagProps} // Aquí se excluye el key
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
                    <Button type="submit" variant="contained" color="primary">
                        Guardar Cambios
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditarEquipo;
