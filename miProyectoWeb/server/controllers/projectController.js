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
        res.json(result.rows);
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

// Crear scan de un proyecto
exports.createProjectScan = async (req, res) => {
    // Iniciar escaneo con openVAS en terminal
    const { projectId } = req.params;
    const { target } = req.body;
    const { exec } = require('child_process');
    exec(`openvas-cli create-target ${target}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
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
        res.status(201).json(result);
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
            res.json({ message: 'Proyecto eliminado' });
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
