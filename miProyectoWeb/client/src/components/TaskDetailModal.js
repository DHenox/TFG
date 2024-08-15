import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const TaskDetailModal = ({ task, open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyles }}>
                <Typography variant="h6">
                    {task ? task.title : 'New Task'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    {task ? task.description : 'Enter task details...'}
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                        {task ? 'Edit Task' : 'Create Task'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default TaskDetailModal;

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
