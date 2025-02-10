const Project = require('../models/projectModel');

// Obtener un proyecto específico
exports.getProject = async (req, res) => {
    try {
        const result = await Project.get(req.params.projectId);
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas de un proyecto
exports.getProjectTasks = async (req, res) => {
    try {
        const result = await Project.getTasks(req.params.projectId);
        let tasks = result.rows;

        // Formatear las fechas para eliminar la hora
        tasks = tasks.map((task) => ({
            ...task,
            start_date: task.start_date.toISOString().split('T')[0],
            end_date: task.end_date.toISOString().split('T')[0],
        }));

        // Obtener los usuarios asignados a cada tarea
        for (let task of tasks) {
            // Incluir los usuarios asignados a cada tarea
            const assignedUsersResult = await Project.getTaskAssignedUsers(
                task.id
            );

            // Para las tareas de Scanning incluir si ya se ha realizado el escaneo
            if (task.type === 'Scanning') {
                const scanningStatusResult = await Project.getScanningStatus(
                    task.id
                );
                task.scanningStatus =
                    scanningStatusResult.rows[0]?.scanning_status ||
                    'not started';
            }
            task.assignedUsers = assignedUsersResult.rows;
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener chats de un proyecto
exports.getProjectChats = async (req, res) => {
    try {
        const result = await Project.getChats(req.params.projectId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener usuarios de un proyecto
exports.getProjectUsers = async (req, res) => {
    try {
        const result = await Project.getUsers(req.params.projectId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo proyecto
exports.createProject = async (req, res) => {
    try {
        const { name, description, userId, teamId } = req.body;
        const result = await Project.create({
            name,
            description,
            userId,
            teamId,
        });

        // Emitir el nuevo proyecto a todos los clientes conectados
        req.io.emit('newProject', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un proyecto existente
exports.updateProject = async (req, res) => {
    try {
        const { name, description, teamId } = req.body;
        const result = await Project.update(req.params.projectId, {
            name,
            description,
            teamId,
        });
        if (result.rowCount > 0) {
            // Emitir el proyecto actualizado a todos los clientes conectados
            req.io.emit('updateProject', result.rows[0]);
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un proyecto
exports.deleteProject = async (req, res) => {
    try {
        const result = await Project.delete(req.params.projectId);
        if (result.rowCount > 0) {
            // Emitir el proyecto eliminado a todos los clientes conectados
            req.io.emit('deleteProject', result.rows[0]);
            res.json({ message: 'Proyecto eliminado' });
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
