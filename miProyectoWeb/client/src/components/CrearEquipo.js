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

const CrearEquipo = ({ open, onCreate, onClose }) => {
    const { user } = useAuth0();
    const [teamData, setTeamData] = useState({
        name: '',
        description: '',
        members: [],
    });
    const [allUsers, setAllUsers] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
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
                teamData.members.push(user.sub);
            }
            const payload = {
                name: teamData.name,
                description: teamData.description,
                userId: user.sub,
                members: teamData.members,
            };
            onCreate(payload);
            onClose();
        } catch (error) {
            console.error('Error al crear equipo:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Team</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Team Name"
                        name="name"
                        sx={{ mt: 1 }}
                        value={teamData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={teamData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <Autocomplete
                        multiple
                        options={allUsers || []}
                        getOptionLabel={(option) =>
                            option.nickname || option.name || ''
                        }
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
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
                                label="Select Members"
                                variant="outlined"
                                fullWidth
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

export default CrearEquipo;
