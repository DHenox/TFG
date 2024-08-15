const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Crear un nuevo equipo
router.post('/', teamController.createTeam);

// Actualizar un equipo existente
router.put('/:teamId', teamController.updateTeam);

// Eliminar un equipo
router.delete('/:teamId', teamController.deleteTeam);

module.exports = router;
