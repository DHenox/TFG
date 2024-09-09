import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Chip,
    LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CrearProyecto from './CrearProyecto';
import CrearEquipo from './CrearEquipo';
import EditarProyecto from './EditarProyecto';
import EditarEquipo from './EditarEquipo';

const CustomList = ({
    role,
    onCreate,
    onEdit,
    onDelete,
    type,
    items,
    emptyMessage = 'No hay elementos disponibles.',
}) => {
    const [openCrearDialog, setOpenCrearDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [dialogType, setDialogType] = useState(null);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    const handleOpenCrearDialog = (type) => {
        setDialogType(type);
        setOpenCrearDialog(true);
    };

    const handleCloseCrearDialog = () => {
        setOpenCrearDialog(false);
        setDialogType(null);
    };

    const handleOpenEditDialog = (type, item) => {
        setDialogType(type);
        setSelectedItem(item);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setDialogType(null);
        setSelectedItem(null);
    };

    const handleOpenDeleteConfirm = (item) => {
        setSelectedItem(item);
        setOpenDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
        setSelectedItem(null);
    };

    const handleConfirmDelete = () => {
        if (selectedItem) {
            onDelete(selectedItem.id);
        }
        handleCloseDeleteConfirm();
    };

    const handleItemClick = (id) => {
        if (type === 'Project') {
            navigate(`/dashboard/projects/${id}`);
        }
    };

    const calculateProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;

        // Filtra los valores null o indefinidos del array de tareas
        const validTasks = tasks.filter((task) => task !== null);

        if (validTasks.length === 0) return 0;

        const completedTasks = validTasks.filter(
            (task) => task.status === 'completed'
        ).length;
        return (completedTasks / validTasks.length) * 100;
    };

    // Función para calcular el color del texto en función del progreso
    const getContrastColor = (progress) => {
        // Define los colores del gradiente
        const colorStart = '#3cf6bb'; // Color inicial del gradiente
        const colorEnd = '#e5e5e5'; // Color final del gradiente

        // Calcula el color basado en el progreso
        const r1 = parseInt(colorStart.slice(1, 3), 16);
        const g1 = parseInt(colorStart.slice(3, 5), 16);
        const b1 = parseInt(colorStart.slice(5, 7), 16);

        const r2 = parseInt(colorEnd.slice(1, 3), 16);
        const g2 = parseInt(colorEnd.slice(3, 5), 16);
        const b2 = parseInt(colorEnd.slice(5, 7), 16);

        const r = Math.round(r1 + (r2 - r1) * (progress / 100));
        const g = Math.round(g1 + (g2 - g1) * (progress / 100));
        const b = Math.round(b1 + (b2 - b1) * (progress / 100));

        // Usa un color de texto que contraste con el color calculado
        const luminance = r * 0.299 + g * 0.587 + b * 0.114;
        return luminance > 186 ? '#000000' : '#ffffff'; // Blanco o negro dependiendo de la luminancia
    };

    return (
        <div>
            {role === 'manager' && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenCrearDialog(type)}
                    >
                        {`Create ${type}`}
                    </Button>

                    <Dialog
                        open={openCrearDialog}
                        onClose={handleCloseCrearDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogContent>
                            {dialogType === 'Project' ? (
                                <CrearProyecto
                                    open={openCrearDialog}
                                    onCreate={onCreate}
                                    onClose={handleCloseCrearDialog}
                                />
                            ) : (
                                <CrearEquipo
                                    open={openCrearDialog}
                                    onCreate={onCreate}
                                    onClose={handleCloseCrearDialog}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={openEditDialog}
                        onClose={handleCloseEditDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogContent>
                            {selectedItem && dialogType === 'Project' ? (
                                <EditarProyecto
                                    item={selectedItem}
                                    open={openEditDialog}
                                    onEdit={onEdit}
                                    onClose={handleCloseEditDialog}
                                />
                            ) : (
                                selectedItem && (
                                    <EditarEquipo
                                        item={selectedItem}
                                        open={openEditDialog}
                                        onEdit={onEdit}
                                        onClose={handleCloseEditDialog}
                                    />
                                )
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={openDeleteConfirm}
                        onClose={handleCloseDeleteConfirm}
                    >
                        <DialogTitle>Confirm delete</DialogTitle>
                        <DialogContent>
                            {selectedItem && (
                                <>
                                    Are you sure you want to delete{' '}
                                    {selectedItem.name}?
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCloseDeleteConfirm}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                variant="contained"
                                color="error"
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
            <List>
                {items.length === 0 ? (
                    <Typography variant="body1" align="center">
                        {emptyMessage}
                    </Typography>
                ) : (
                    items.map((item, index) => {
                        const progress = calculateProgress(item.tasks);
                        const textColor = getContrastColor(progress);

                        return (
                            <ListItem
                                key={index}
                                sx={{
                                    cursor:
                                        type === 'Project'
                                            ? 'pointer'
                                            : 'default',
                                    backgroundColor: 'background.paper',
                                    transition: 'background-color 0.3s',
                                    margin: '8px 0',
                                    '&:hover': {
                                        backgroundColor:
                                            type === 'Project' &&
                                            'background.hover',
                                    },
                                    padding: '16px',
                                    gap: 16,
                                    alignItems: 'start',
                                    borderRadius: '8px',
                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={() => handleItemClick(item.id)}
                            >
                                {type === 'Project' ? (
                                    <Box sx={{ width: '100%' }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                                mb: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    {item.name}
                                                </Typography>
                                                <Chip
                                                    label={item.team.name}
                                                    sx={{
                                                        border: '1px solid #3cf6bb',
                                                        color: '#3cf6bb',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                {item.description}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                mt: 2,
                                            }}
                                        >
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={progress}
                                                        sx={{
                                                            height: 20,
                                                            borderRadius: 5,
                                                            backgroundColor:
                                                                'background.default',
                                                            '& .MuiLinearProgress-bar':
                                                                {
                                                                    // Haz que backgroundColor sea con gradiente
                                                                    backgroundImage: `linear-gradient(90deg, #3cf6bb 0%, #e5e5e5 100%)`,
                                                                    borderRadius: 5,
                                                                },
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            position:
                                                                'absolute',
                                                            top: 0,
                                                            left: '50%',
                                                            transform:
                                                                'translateX(-50%)',
                                                            color: textColor,
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {`${Math.round(
                                                            progress
                                                        )}%`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ) : (
                                    <ListItemText
                                        primary={item.name}
                                        secondary={item.description}
                                    />
                                )}
                                {role === 'manager' && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 2,
                                        }}
                                    >
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEditDialog(
                                                    type,
                                                    item
                                                );
                                            }}
                                            sx={{
                                                border: '1px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDeleteConfirm(item);
                                            }}
                                            sx={{
                                                border: '1px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor:
                                                        'secondary.main',
                                                },
                                            }}
                                        >
                                            <DeleteIcon color="secondary" />
                                        </IconButton>
                                    </Box>
                                )}
                            </ListItem>
                        );
                    })
                )}
            </List>
        </div>
    );
};

export default CustomList;
