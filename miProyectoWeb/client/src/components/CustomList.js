import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Necesario para redirección
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
    const navigate = useNavigate(); // Hook para redirección

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
                                color="secondary"
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
                    items.map((item, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                cursor:
                                    type === 'Project' ? 'pointer' : 'default',
                                backgroundColor: 'background.paper',
                                transition: 'background-color 0.3s',
                                margin: '4px 0',
                                '&:hover': {
                                    backgroundColor:
                                        type === 'Project' &&
                                        'background.hover',
                                },
                            }}
                            onClick={() => handleItemClick(item.id)}
                        >
                            <ListItemText
                                primary={item.name}
                                secondary={item.description}
                            />
                            {role === 'manager' && (
                                <ListItemSecondaryAction
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 2,
                                    }}
                                >
                                    <IconButton
                                        edge="end"
                                        onClick={() =>
                                            handleOpenEditDialog(type, item)
                                        }
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
                                        onClick={() =>
                                            handleOpenDeleteConfirm(item)
                                        }
                                        sx={{
                                            border: '1px solid',
                                            transition: 'border-color 0.3s',
                                            '&:hover': {
                                                borderColor: 'secondary.main',
                                            },
                                        }}
                                    >
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    ))
                )}
            </List>
        </div>
    );
};

export default CustomList;
