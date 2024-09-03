import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Autocomplete,
    Avatar,
    Chip,
    CircularProgress,
} from '@mui/material';
import ScanModal from './ScanModal';
import api from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingIcon from '@mui/icons-material/Pending';

const taskTypes = [
    { label: 'Reconnaissance', color: '#2196f3' },
    { label: 'Scanning', color: '#ff9800' },
    { label: 'Exploitation', color: '#f44336' },
    { label: 'Post-Exploitation', color: '#4caf50' },
    { label: 'Reporting', color: '#9c27b0' },
    { label: 'Administrative', color: '#795548' },
];

const taskStatuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
];

const TaskList = ({ projectId, tasks, users }) => {
    const { user } = useAuth0();
    const [selectedTask, setSelectedTask] = useState(null);
    const [projectTasks, setProjectTasks] = useState(tasks);
    const [openModal, setOpenModal] = useState(false);
    const [newTask, setNewTask] = useState({
        type: '',
        name: '',
        description: '',
        status: 'pending',
        startDate: '',
        endDate: '',
        projectId: projectId,
        userId: user.sub,
        assignedUsers: [],
    });
    const [openStartScanModal, setOpenStartScanModal] = useState(false);
    const [scanData, setScanData] = useState(null);
    const [ipAddress, setIpAddress] = useState('');
    const [scanningTask, setScanningTask] = useState(null);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false); // Añadido estado de carga

    useEffect(() => {
        if (selectedTask) {
            setNewTask({
                type: selectedTask.type || '',
                name: selectedTask.name || '',
                description: selectedTask.description || '',
                status: selectedTask.status || 'pending',
                startDate: selectedTask.start_date || '',
                endDate: selectedTask.end_date || '',
                projectId: selectedTask.project_id || projectId,
                userId: selectedTask.user_id || user.sub,
                assignedUsers: selectedTask.assignedUsers || [],
            });
            setIsEditing(true);
        }
    }, [selectedTask, projectId, user.sub]);

    const handleOpenModal = (task) => {
        if (task) {
            setSelectedTask(task);
        } else {
            setNewTask({
                type: '',
                name: '',
                description: '',
                status: 'pending',
                startDate: '',
                endDate: '',
                projectId: projectId,
                userId: user.sub,
                assignedUsers: [],
            });
            setIsEditing(false);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setOpenModal(false);
        setErrors({});
    };

    const handleTaskChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleAssignedUsersChange = (event, value) => {
        setNewTask({ ...newTask, assignedUsers: value });
    };

    const validateInputs = () => {
        let tempErrors = {};
        if (!newTask.type) tempErrors.type = 'El tipo de tarea es obligatorio';
        if (!newTask.name)
            tempErrors.name = 'El nombre de la tarea es obligatorio';
        if (!newTask.description)
            tempErrors.description = 'La descripción es obligatoria';
        if (!newTask.startDate)
            tempErrors.startDate = 'La fecha de inicio es obligatoria';
        if (!newTask.endDate)
            tempErrors.endDate = 'La fecha de finalización es obligatoria';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleTaskSubmit = async () => {
        if (!validateInputs()) return;

        try {
            if (isEditing) {
                await api.updateTask(selectedTask.id, newTask);
            } else {
                await api.createTask(newTask);
            }

            handleCloseModal();
            const newProjectTasks = await api.getProjectTasks(projectId);
            console.log(newProjectTasks);
            setProjectTasks(newProjectTasks);
        } catch (err) {
            console.error('Failed to submit task', err);
        }
    };

    const getTaskStyle = (type) => {
        switch (type) {
            case 'Reconnaissance':
                return {
                    borderLeft: '2px solid #2196f3',
                    '&:hover': {
                        border: '2px solid #2196f3',
                        backgroundColor: 'background.hover',
                    },
                };
            case 'Scanning':
                return {
                    borderLeft: '2px solid #ff9800',
                    '&:hover': {
                        border: '2px solid #ff9800',
                        backgroundColor: 'background.hover',
                    },
                };
            case 'Exploitation':
                return {
                    borderLeft: '2px solid #f44336',
                    '&:hover': {
                        border: '2px solid #f44336',
                        backgroundColor: 'background.hover',
                    },
                };
            case 'Post-Exploitation':
                return {
                    borderLeft: '2px solid #4caf50',
                    '&:hover': {
                        border: '2px solid #4caf50',
                        backgroundColor: 'background.hover',
                    },
                };
            case 'Reporting':
                return {
                    borderLeft: '2px solid #9c27b0',
                    '&:hover': {
                        border: '2px solid #9c27b0',
                        backgroundColor: 'background.hover',
                    },
                };
            case 'Administrative':
                return {
                    borderLeft: '2px solid #795548',
                    '&:hover': {
                        border: '2px solid #795548',
                        backgroundColor: 'background.hover',
                    },
                };
            default:
                return {
                    borderLeft: '2px solid #9e9e9e',
                    '&:hover': {
                        border: '2px solid #9e9e9e',
                        backgroundColor: 'background.hover',
                    },
                };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#1aff00' }} />;
            case 'in-progress':
                return <HourglassEmptyIcon sx={{ color: '#ff4400' }} />;
            case 'pending':
            default:
                return <PendingIcon sx={{ color: '#ffffff' }} />;
        }
    };

    const handleOpenStartScanModal = (task) => {
        setScanningTask(task);
        setOpenStartScanModal(true);
    };

    const handleCloseStartScanModal = () => {
        setOpenStartScanModal(false);
        setIpAddress('');
        setErrors({});
    };

    const handleStartScan = async () => {
        // Validar la IP
        if (ipAddress.trim().length === 0 || ipAddress.includes(' ')) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ipAddress:
                    'La dirección IP no puede contener espacios en blanco.',
            }));
            return;
        }

        setErrors({}); // Limpiar errores si la IP es válida
        setLoading(true); // Mostrar el icono de carga

        try {
            console.log(
                `Iniciando escaneo para la IP: ${ipAddress} en la tarea: ${scanningTask.name}`
            );
            const scanResults = await api.createScan(scanningTask.id, {
                target: ipAddress,
            });

            setScanData(scanResults);
        } catch (err) {
            console.error('Failed to start scan', err);
        } finally {
            setLoading(false); // Desactivar el icono de carga
            handleCloseStartScanModal(); // Cerrar el modal después de iniciar el escaneo
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Tasks
            </Typography>
            <Box>
                {projectTasks.map((task) => (
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
                        onClick={() => handleOpenModal(task)}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {task.name}
                                </Typography>
                                <Box sx={{ p: 0.25 }}>
                                    {getStatusIcon(task.status)}
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    mt: 0.5,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {task.description}
                                </Typography>
                                {task.type === 'Scanning' && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#ff9800',
                                        }}
                                        onClick={(event) => {
                                            event.stopPropagation(); // Detener la propagación del evento de clic
                                            handleOpenStartScanModal(task);
                                        }}
                                    >
                                        Start Scan
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
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
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {isEditing ? 'Editar tarea' : 'Crear nueva tarea'}
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <TextField
                            select
                            label="Tipo de tarea"
                            name="type"
                            sx={{ mt: 1 }}
                            value={newTask.type}
                            onChange={handleTaskChange}
                            fullWidth
                            required
                            error={!!errors.type}
                            helperText={errors.type}
                        >
                            {taskTypes.map((option) => (
                                <MenuItem
                                    key={option.label}
                                    value={option.label}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            backgroundColor: option.color,
                                            borderRadius: '50%',
                                            marginRight: 2,
                                        }}
                                    />
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Estado de la tarea"
                            name="status"
                            sx={{ mt: 1 }}
                            value={newTask.status}
                            onChange={handleTaskChange}
                            fullWidth
                            required
                        >
                            {taskStatuses.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Nombre de la tarea"
                            name="name"
                            value={newTask.name}
                            onChange={handleTaskChange}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Descripción"
                            name="description"
                            value={newTask.description}
                            onChange={handleTaskChange}
                            multiline
                            rows={4}
                            fullWidth
                            required
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                        <TextField
                            label="Fecha de inicio"
                            name="startDate"
                            type="date"
                            value={newTask.startDate}
                            onChange={handleTaskChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                        />
                        <TextField
                            label="Fecha de finalización"
                            name="endDate"
                            type="date"
                            value={newTask.endDate}
                            onChange={handleTaskChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                        />
                        <Autocomplete
                            multiple
                            options={users || []}
                            getOptionLabel={(option) =>
                                option.nickname || option.name || ''
                            }
                            isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                            }
                            value={newTask.assignedUsers}
                            onChange={handleAssignedUsersChange}
                            renderOption={(props, option) => (
                                <li
                                    {...props}
                                    key={option.id}
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        color: '#333',
                                    }}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            '#dcdcdc')
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            '#f5f5f5')
                                    }
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
                                            avatar={
                                                <Avatar src={option.picture} />
                                            }
                                            label={
                                                option.nickname || option.name
                                            }
                                            {...tagProps}
                                        />
                                    );
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Asignar usuarios"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTaskSubmit}
                    >
                        {isEditing ? 'Guardar cambios' : 'Crear tarea'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openStartScanModal}
                onClose={handleCloseStartScanModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Start Scan</DialogTitle>
                <DialogContent>
                    <TextField
                        label="IP Address"
                        sx={{ mt: 1 }}
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.ipAddress}
                        helperText={errors.ipAddress}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStartScanModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartScan}
                        startIcon={
                            loading && (
                                <CircularProgress color="inherit" size={24} />
                            )
                        }
                    >
                        {loading ? 'Scanning...' : 'Scan'}
                    </Button>
                </DialogActions>
            </Dialog>
            <ScanModal
                open={scanData !== null}
                onClose={() => setScanData(null)}
                scanData={scanData}
            />
        </Box>
    );
};

export default TaskList;
