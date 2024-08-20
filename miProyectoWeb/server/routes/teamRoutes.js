const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Obtener un equipo específico
router.get('/:teamId', teamController.getTeam);

// Obtener usuarios de un equipo
router.get('/:teamId/users', teamController.getTeamUsers);

// Crear un nuevo equipo
router.post('/', teamController.createTeam);

// Actualizar un equipo existente
router.put('/:teamId', teamController.updateTeam);

// Eliminar un equipo
router.delete('/:teamId', teamController.deleteTeam);

module.exports = router;
