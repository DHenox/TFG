const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Obtener usuario específico
router.get('/:userId', userController.getUser);

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener todos los proyectos en los que está involucrado un usuario
router.get('/:userId/projects', userController.getUserProjects);

// Obtener todos los equipos de los que forma parte un usuario
router.get('/:userId/teams', userController.getUserTeams);

// Crear un nuevo usuario
router.post('/', userController.createUser);

// Actualizar un usuario existente
router.put('/:userId', userController.updateUser);

module.exports = router;
