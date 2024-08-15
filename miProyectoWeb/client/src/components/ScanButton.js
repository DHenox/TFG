import React, { useState } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';

const ScanButton = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Definir los estilos para el modal
    const modalStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                sx={{ mt: 2 }}
            >
                New Scan
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...modalStyles }}>
                    <Typography variant="h6">New Port Scan</Typography>
                    <TextField
                        label="Command"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                        Run Scan
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default ScanButton;
