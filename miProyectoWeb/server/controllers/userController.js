const User = require('../models/userModel.js');

// Obtener un usuario específico
exports.getUser = async (req, res) => {
    try {
        const result = await User.getById(req.params.userId);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const result = await User.getAll();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los proyectos de un usuario
exports.getUserProjects = async (req, res) => {
    try {
        const result = await User.getProjects(req.params.userId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los equipos de un usuario
exports.getUserTeams = async (req, res) => {
    try {
        const result = await User.getTeams(req.params.userId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const result = await User.create(req.body);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario existente
exports.updateUser = async (req, res) => {
    try {
        const result = await User.update(req.params.userId, req.body);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
