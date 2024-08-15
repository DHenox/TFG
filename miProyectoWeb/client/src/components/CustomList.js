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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CrearProyecto from './CrearProyecto';
import CrearEquipo from './CrearEquipo';

const CustomList = ({ role, onCreate, onEdit, onDelete, type, items }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState(null);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogType(null);
    };

    const handleDeleteClick = (item) => {
        console.log('Deleting item:', item);
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

    return (
        <div>
            <List>
                {items.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={item.name}
                            secondary={item.description}
                        />
                        {role === 'manager' && (
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleDeleteClick(item)}
                                >
                                    <DeleteIcon color="secondary" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                ))}
            </List>
            {role === 'manager' && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog(type)}
                    >
                        {`Crear ${type}`}
                    </Button>

                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>{`Crear ${type}`}</DialogTitle>
                        <DialogContent>
                            {dialogType === 'Proyecto' ? (
                                <CrearProyecto
                                    open={openDialog}
                                    onCreate={onCreate}
                                    onClose={handleCloseDialog}
                                />
                            ) : (
                                <CrearEquipo
                                    open={openDialog}
                                    onCreate={onCreate}
                                    onClose={handleCloseDialog}
                                />
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Cancelar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Modal de confirmación de eliminación */}
                    <Dialog
                        open={openDeleteConfirm}
                        onClose={handleCloseDeleteConfirm}
                    >
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogContent>
                            ¿Estás seguro de que deseas eliminar{' '}
                            {selectedItem?.name}?
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCloseDeleteConfirm}
                                color="primary"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                color="secondary"
                            >
                                Eliminar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default CustomList;
