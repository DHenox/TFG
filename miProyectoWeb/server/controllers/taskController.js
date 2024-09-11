const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const axios = require('axios');

// Obtener una tarea específica de un proyecto
exports.getTask = async (req, res) => {
    try {
        const result = await Task.get(req.params.taskId);
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
    try {
        const {
            type,
            name,
            description,
            status,
            startDate,
            endDate,
            userId,
            projectId,
            assignedUsers,
        } = req.body;
        const result = await Task.create({
            type,
            name,
            description,
            status,
            startDate,
            endDate,
            userId,
            projectId,
            assignedUsers,
        });
        if (result.rowCount > 0) {
            const task = result.rows[0];

            const assignedUsersResult = await Task.getTaskAssignedUsers(
                task.id
            );

            // Para las tareas de Scanning incluir si ya se ha realizado el escaneo
            if (task.type === 'Scanning') {
                const scanningStatusResult = await Task.getScanningStatus(
                    task.id
                );
                task.scanningStatus =
                    scanningStatusResult.rows[0]?.scanning_status ||
                    'not started';
            }
            task.assignedUsers = assignedUsersResult.rows;
            // Emitir la nueva tarea a todos los clientes conectados
            req.io.emit('newTask', task);
            // Obtener el proyecto al que pertenece la tarea y emitirlo a todos los clientes conectados
            const projectResult = await Project.get(task.project_id);
            const project = projectResult.rows[0];
            req.io.emit('updateProject', project);
            res.json(task);
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar una tarea existente
exports.updateTask = async (req, res) => {
    try {
        const {
            type,
            name,
            description,
            status,
            startDate,
            endDate,
            assignedUsers,
        } = req.body;
        const result = await Task.update(req.params.taskId, {
            type,
            name,
            description,
            status,
            startDate,
            endDate,
            assignedUsers,
        });
        if (result.rowCount > 0) {
            const task = result.rows[0];

            const assignedUsersResult = await Task.getTaskAssignedUsers(
                task.id
            );

            // Para las tareas de Scanning incluir si ya se ha realizado el escaneo
            if (task.type === 'Scanning') {
                const scanningStatusResult = await Task.getScanningStatus(
                    task.id
                );
                task.scanningStatus =
                    scanningStatusResult.rows[0]?.scanning_status ||
                    'not started';
            }
            task.assignedUsers = assignedUsersResult.rows;
            // Emitir la tarea actualizada a todos los clientes conectados
            req.io.emit('updateTask', task);
            // Obtener el proyecto al que pertenece la tarea y emitirlo a todos los clientes conectados
            const projectResult = await Project.get(task.project_id);
            const project = projectResult.rows[0];
            req.io.emit('updateProject', project);
            res.json(task);
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        const result = await Task.delete(req.params.taskId);
        if (result.rowCount > 0) {
            const task = result.rows[0];
            // Emitir la tarea eliminada a todos los clientes conectados
            req.io.emit('deleteTask', task);
            // Obtener el proyecto al que pertenece la tarea y emitirlo a todos los clientes conectados
            const projectResult = await Project.get(task.project_id);
            const project = projectResult.rows[0];
            req.io.emit('updateProject', project);
            res.json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
