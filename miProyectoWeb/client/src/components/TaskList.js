import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import TaskDetailModal from './TaskDetailModal.js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingIcon from '@mui/icons-material/Pending';

const TaskList = ({ tasks }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setOpenModal(true);
    };

    // Función para obtener los estilos basados en el tipo de tarea
    const getTaskStyle = (type) => {
        switch (type) {
            case 'Reconnaissance':
                return {
                    borderLeft: '2px solid #2196f3',
                    '&:hover': {
                        border: '2px solid #2196f3',
                        backgroundColor: 'background.hover',
                    },
                }; // Azul
            case 'Scanning':
                return {
                    borderLeft: '2px solid #ff9800',
                    '&:hover': {
                        border: '2px solid #ff9800',
                        backgroundColor: 'background.hover',
                    },
                }; // Naranja
            case 'Exploitation':
                return {
                    borderLeft: '2px solid #f44336',
                    '&:hover': {
                        border: '2px solid #f44336',
                        backgroundColor: 'background.hover',
                    },
                }; // Rojo
            case 'Post-Exploitation':
                return {
                    borderLeft: '2px solid #4caf50',
                    '&:hover': {
                        border: '2px solid #4caf50',
                        backgroundColor: 'background.hover',
                    },
                }; // Verde
            case 'Reporting':
                return {
                    borderLeft: '2px solid #9c27b0',
                    '&:hover': {
                        border: '2px solid #9c27b0',
                        backgroundColor: 'background.hover',
                    },
                }; // Púrpura
            case 'Administrative':
                return {
                    borderLeft: '2px solid #795548',
                    '&:hover': {
                        border: '2px solid #795548',
                        backgroundColor: 'background.hover',
                    },
                }; // Marrón
            default:
                return {
                    borderLeft: '2px solid #9e9e9e',
                    '&:hover': {
                        border: '2px solid #9e9e9e',
                        backgroundColor: 'background.hover',
                    },
                }; // Gris
        }
    };

    // Función para obtener el icono y color basado en el estado de la tarea
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <PendingIcon sx={{ color: '#ff9800' }} />;
            case 'in_progress':
                return <HourglassEmptyIcon sx={{ color: '#2196f3' }} />;
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
            default:
                return null;
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Tasks
            </Typography>
            <Box>
                {tasks.map((task) => (
                    <Card
                        key={task.id}
                        sx={{
                            mb: 2,
                            cursor: 'pointer',
                            border: '2px solid transparent',
                            ...getTaskStyle(task.type),
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <CardContent
                            sx={{ flexGrow: 1 }}
                            onClick={() => handleOpenModal(task)}
                        >
                            <Typography
                                variant="body1"
                                sx={{ fontWeight: 'bold' }}
                            >
                                {task.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >
                                {task.description}
                            </Typography>
                        </CardContent>
                        <Box sx={{ p: 2 }}>{getStatusIcon(task.status)}</Box>
                    </Card>
                ))}
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal(null)}
            >
                Add Task
            </Button>
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </Box>
    );
};

export default TaskList;
