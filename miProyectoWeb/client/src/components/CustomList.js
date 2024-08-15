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

const CustomList = ({ items, onDelete, type }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState(null);

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogType(null);
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
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                onClick={() => onDelete(item.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog(type)}
            >
                {type === 'project' ? 'Crear Proyecto' : 'Crear Equipo'}
            </Button>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {type === 'project' ? 'Crear Proyecto' : 'Crear Equipo'}
                </DialogTitle>
                <DialogContent>
                    {dialogType === 'project' ? (
                        <CrearProyecto
                            open={openDialog}
                            onClose={handleCloseDialog}
                        />
                    ) : (
                        <CrearEquipo
                            open={openDialog}
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
        </div>
    );
};

export default CustomList;
