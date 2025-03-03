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
    Select,
    InputLabel,
    FormControl,
    Tooltip,
    Checkbox,
    Switch,
    FormControlLabel,
} from '@mui/material';
import ScanModal from './ScanModal';
import api from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Pending, Assignment } from '@mui/icons-material';
import socket from '../utils/socket';

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
    const [projectTasks, setProjectTasks] = useState(tasks);
    const [selectedTask, setSelectedTask] = useState(null);
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
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('created'); // Estado para la opción de ordenación
    const [emailNotification, setEmailNotification] = useState(false);
    const [tcpSynScan, setTcpSynScan] = useState(false);
    const [udpScan, setUdpScan] = useState(false);
    const [aggressiveTiming, setAggressiveTiming] = useState(false);
    const [command, setCommand] = useState('nmap');
    const [commandBase, setCommandBase] = useState('nmap -sV --script vulners');
    const [commandOptions, setCommandOptions] = useState('');
    const [ports, setPorts] = useState('');
    const [commandTarget, setCommandTarget] = useState('');

    useEffect(() => {
        // Construir comando en tiempo real
        setCommandBase('nmap -sV --script vulners');
        let newCommand = 'nmap -sV --script vulners';
        let newCommandOptions = '';
        if (tcpSynScan) {
            newCommand += ' -sS';
            newCommandOptions += ' -sS';
        }
        if (udpScan) {
            newCommand += ' -sU';
            newCommandOptions += ' -sU';
        }
        if (aggressiveTiming) {
            newCommand += ' -T4';
            newCommandOptions += ' -T4';
        }
        if (ports.trim().length > 0) {
            if (ports === '*') {
                newCommand += ' -p-';
                newCommandOptions += ' -p-';
            } else {
                newCommand += ` -p ${ports}`;
                newCommandOptions += ` -p ${ports}`;
            }
        }
        setCommandOptions(newCommandOptions);
        if (ipAddress.trim().length > 0) {
            newCommand += ` ${ipAddress}`;
            setCommandTarget(` ${ipAddress}`);
        } else {
            setCommandTarget('');
        }

        setCommand(newCommand);
    }, [tcpSynScan, udpScan, aggressiveTiming, ports, ipAddress]);

    // Función para ordenar las tareas
    const sortTasks = (tasks, option) => {
        switch (option) {
            case 'created':
                return [...tasks].sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
            case 'start':
                return [...tasks].sort(
                    (a, b) => new Date(a.start_date) - new Date(b.start_date)
                );
            case 'end':
                return [...tasks].sort(
                    (a, b) => new Date(a.end_date) - new Date(b.end_date)
                );
            default:
                return tasks;
        }
    };
    const sortedTasks = sortTasks(projectTasks, sortOption);

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

    // WebSocket para escuchar eventos relacionados con las tareas
    useEffect(() => {
        // Listener para nueva tarea
        socket.on('newTask', (newTask) => {
            if (newTask.project_id === Number(projectId))
                setProjectTasks((prevTasks) => [...prevTasks, newTask]);
        });

        // Listener para tarea actualizada
        socket.on('updateTask', (updatedTask) => {
            if (updatedTask.project_id === Number(projectId))
                setProjectTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task
                    )
                );
        });

        // Listener para tarea eliminada
        socket.on('deleteTask', (deletedTask) => {
            if (deletedTask.project_id === Number(projectId))
                setProjectTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== deletedTask.id)
                );
        });

        return () => {
            socket.off('newTask');
            socket.off('updateTask');
            socket.off('deleteTask');
        };
    }, [projectTasks, projectId]);

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
        if (!newTask.type) tempErrors.type = 'Task type is required';
        if (!newTask.name) tempErrors.name = 'Task name is required';
        if (!newTask.description)
            tempErrors.description = 'Task description is required';
        if (!newTask.startDate)
            tempErrors.startDate = 'Task start date is required';
        if (!newTask.endDate) tempErrors.endDate = 'Task end date is required';
        if (new Date(newTask.startDate) > new Date(newTask.endDate))
            tempErrors.endDate = 'End date must be after start date';

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
                return <Pending sx={{ color: '#ffffff' }} />;
        }
    };

    const handleDeleteTask = async () => {
        try {
            if (selectedTask) {
                await api.deleteTask(selectedTask.id);
                handleCloseModal();
                const newProjectTasks = await api.getProjectTasks(projectId);
                setProjectTasks(newProjectTasks);
            }
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    const handleOpenStartScanModal = (task) => {
        setScanningTask(task);
        setOpenStartScanModal(true);
    };

    const handleCloseStartScanModal = () => {
        setOpenStartScanModal(false);
        setIpAddress('');
        setCommandOptions('');
        setPorts('');
        setErrors({});
    };

    const handleStartScan = async () => {
        // Validar la IP
        if (ipAddress.trim().length === 0 || ipAddress.includes(' ')) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ipAddress: 'Please enter a valid IP address.',
            }));
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const scanResults = await api.createScan(scanningTask.id, {
                target: ipAddress,
                command: command,
                emailNotification,
                email: user.email,
            });
            scanningTask.scanningStatus = 'started';

            setScanData(scanResults);
        } catch (err) {
            console.error('Failed to start scan', err);
        } finally {
            setLoading(false);
            handleCloseStartScanModal();
        }
    };

    const handleShowScanResults = async (task) => {
        try {
            const scanResults = await api.getScan(task.id);
            setScanningTask(task);
            setScanData(scanResults);
        } catch (err) {
            console.error('Failed to fetch scan results', err);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        gap: 1,
                    }}
                >
                    <Assignment sx={{ fontSize: '34px' }} />
                    <Typography variant="h4">Tasks</Typography>
                </Box>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="sort-tasks-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-tasks-label"
                        value={sortOption}
                        label="Sort By"
                        sx={{
                            '& .MuiSelect-select': {
                                padding: '4px 14px',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'gray',
                            },
                        }}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <MenuItem value="created">Creation Date</MenuItem>
                        <MenuItem value="start">Start Date</MenuItem>
                        <MenuItem value="end">End Date</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal(null)}
                sx={{ mb: 2, width: '200px', alignSelf: 'center' }}
            >
                Add Task
            </Button>
            <Box>
                {sortedTasks.map((task) => (
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
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {task.name}
                                    </Typography>
                                    {/* Avatares de usuarios asignados */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'start',
                                            gap: 0.5,
                                        }}
                                    >
                                        {task.assignedUsers.map(
                                            (assignedUser) => (
                                                <Tooltip
                                                    key={assignedUser.id}
                                                    title={
                                                        assignedUser.nickname ||
                                                        assignedUser.name
                                                    }
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Avatar
                                                        src={
                                                            assignedUser.picture
                                                        }
                                                        alt={assignedUser.name}
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                        }}
                                                    />
                                                </Tooltip>
                                            )
                                        )}
                                    </Box>
                                </Box>
                                <Tooltip
                                    title={`${task.type} task ${task.status}`}
                                    arrow
                                    placement="top"
                                >
                                    <Box sx={{ p: 0.25 }}>
                                        {getStatusIcon(task.status)}
                                    </Box>
                                </Tooltip>
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
                                    sx={{
                                        color: 'text.secondary',
                                        width: '80%',
                                    }}
                                >
                                    {task.description}
                                </Typography>
                                {task.type === 'Scanning' &&
                                    task.scanningStatus === 'not started' && (
                                        <Button
                                            variant="contained"
                                            color="scanning"
                                            sx={{
                                                color: 'black',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                height: '40px',
                                            }}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleOpenStartScanModal(task);
                                            }}
                                        >
                                            Start Scan
                                        </Button>
                                    )}
                                {task.type === 'Scanning' &&
                                    task.scanningStatus === 'started' && (
                                        <Button
                                            variant="contained"
                                            color="scanning"
                                            sx={{
                                                color: 'black',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                height: '40px',
                                            }}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleShowScanResults(task);
                                            }}
                                        >
                                            Show results
                                        </Button>
                                    )}
                            </Box>
                            <Box
                                sx={{
                                    mt: 1.5,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.tertiary',
                                    }}
                                >
                                    {`Start: ${
                                        new Date(task.start_date)
                                            .toLocaleString()
                                            .split(',')[0]
                                    }`}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.tertiary',
                                    }}
                                >
                                    {`End: ${
                                        new Date(task.end_date)
                                            .toLocaleString()
                                            .split(',')[0]
                                    }`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md" // Aumentado el tamaño máximo
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, // Divido en columnas en pantallas más grandes
                            gap: 3, // Más espacio entre los elementos
                            p: 2, // Padding interno para mayor espacio
                        }}
                    >
                        {/* Primera columna */}
                        <TextField
                            select
                            label="Task Type"
                            name="type"
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
                            label="Task Status"
                            name="status"
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
                            label="Task Name"
                            name="name"
                            value={newTask.name}
                            onChange={handleTaskChange}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ gridColumn: '1 / span 2' }} // Ocupa toda la fila
                        />

                        <TextField
                            label="Task Description"
                            name="description"
                            value={newTask.description}
                            onChange={handleTaskChange}
                            multiline
                            rows={6} // Aumento del tamaño
                            fullWidth
                            required
                            error={!!errors.description}
                            helperText={errors.description}
                            sx={{ gridColumn: '1 / span 2' }} // Descripción mucho más grande
                        />

                        <TextField
                            label="Start Date"
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
                            label="End Date"
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
                                    label="Assign Users"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            sx={{ gridColumn: '1 / span 2' }} // Ocupa toda la fila
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    {isEditing && (
                        <Button
                            onClick={handleDeleteTask}
                            variant="contained"
                            color="error"
                            sx={{ mr: 'auto' }}
                        >
                            Delete Task
                        </Button>
                    )}
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTaskSubmit}
                    >
                        {isEditing ? 'Save' : 'Create Task'}
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
                <div>
                    <Box sx={{ px: 3 }}>
                        <Box
                            sx={{
                                p: 1,
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'Consolas, monospace',
                                    fontSize: 14,
                                }}
                                variant="span"
                            >
                                {commandBase}
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'orange',
                                    fontFamily: 'Consolas, monospace',
                                    fontSize: 14,
                                }}
                                variant="span"
                            >
                                {commandOptions}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#3cf6bb',
                                    fontFamily: 'Consolas, monospace',
                                    fontSize: 14,
                                }}
                                variant="span"
                            >
                                {commandTarget}
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1">
                            Scan parameters
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={tcpSynScan}
                                    onChange={(e) =>
                                        setTcpSynScan(e.target.checked)
                                    }
                                />
                            }
                            label="TCP SYN Scan (-sS)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={udpScan}
                                    onChange={(e) =>
                                        setUdpScan(e.target.checked)
                                    }
                                />
                            }
                            label="UDP Scan (-sU)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={aggressiveTiming}
                                    onChange={(e) =>
                                        setAggressiveTiming(e.target.checked)
                                    }
                                />
                            }
                            label="Agressive (-T4)"
                        />
                        <TextField
                            onChange={(e) => {
                                setIpAddress(e.target.value);
                            }}
                            fullWidth
                            label="IP Address"
                            variant="outlined"
                            sx={{ mt: 2 }}
                            required
                            error={!!errors.ipAddress}
                            helperText={errors.ipAddress}
                        />
                        <TextField
                            onChange={(e) => setPorts(e.target.value)}
                            fullWidth
                            label="Ports (e.g. 80,443 or 1-1024 or * for all)"
                            variant="outlined"
                            sx={{ mt: 2 }}
                        />
                    </Box>
                    <DialogActions sx={{ justifyContent: 'space-between' }}>
                        {/* Switch para avisos por correo */}
                        <Box sx={{ ml: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={emailNotification}
                                        onChange={(e) =>
                                            setEmailNotification(
                                                e.target.checked
                                            )
                                        }
                                        color="secondary"
                                    />
                                }
                                label="Email notification"
                            />
                        </Box>
                        <Box>
                            <Button onClick={handleCloseStartScanModal}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleStartScan}
                                startIcon={
                                    loading && (
                                        <CircularProgress
                                            color="inherit"
                                            size={24}
                                        />
                                    )
                                }
                            >
                                {loading ? 'Scanning...' : 'Scan'}
                            </Button>
                        </Box>
                    </DialogActions>
                </div>
            </Dialog>
            <ScanModal
                open={scanData !== null}
                onClose={() => {
                    setScanData(null);
                }}
                onDelete={() => {
                    scanningTask.scanningStatus = 'not started';
                }}
                scanData={scanData}
            />
        </Box>
    );
};

export default TaskList;
