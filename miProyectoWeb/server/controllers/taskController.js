const Task = require('../models/taskModel');
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
        res.status(201).json(result);
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
            res.json(result.rows[0]);
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
            res.json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
