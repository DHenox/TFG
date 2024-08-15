const Team = require('../models/teamModel');

// Crear un nuevo equipo
exports.createTeam = async (req, res) => {
    try {
        const { name, description, userId } = req.body;
        const result = await Team.create({ name, description, userId });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un equipo existente
exports.updateTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await Team.update(req.params.teamId, {
            name,
            description,
        });
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
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
