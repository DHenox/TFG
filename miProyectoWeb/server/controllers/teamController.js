const Team = require('../models/teamModel');

// Obtener un equipo específico
exports.getTeam = async (req, res) => {
    try {
        const result = await Team.get(req.params.teamId);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Equipo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener usuarios de un equipo
exports.getTeamUsers = async (req, res) => {
    try {
        const result = await Team.getUsers(req.params.teamId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo equipo
exports.createTeam = async (req, res) => {
    try {
        const { name, description, userId, members } = req.body;
        const result = await Team.create({
            name,
            description,
            userId,
            members,
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un equipo existente
exports.updateTeam = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const result = await Team.update(req.params.teamId, {
            name,
            description,
            members,
        });
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ message: 'Equipo no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un equipo
exports.deleteTeam = async (req, res) => {
    try {
        const result = await Team.delete(req.params.teamId);
        if (result.rowCount > 0) {
            res.json({ message: 'Equipo eliminado' });
        } else {
            res.status(404).json({ message: 'Equipo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
