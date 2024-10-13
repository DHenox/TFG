import React, { useState } from 'react';
import {
    List,
    ListItem,
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
                        const textColor = progress < 50 ? '#ffffff' : '#000000';

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
                                                    justifyContent: 'start',
                                                    gap: 2,
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
                                                    justifyContent: 'start',
                                                    gap: 2,
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    {item.name}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </Box>
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
                                                border: '2px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor:
                                                        'secondary.main',
                                                },
                                            }}
                                        >
                                            <EditIcon color="secondary" />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDeleteConfirm(item);
                                            }}
                                            sx={{
                                                border: '2px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor: 'error.main',
                                                },
                                            }}
                                        >
                                            <DeleteIcon color="error" />
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
