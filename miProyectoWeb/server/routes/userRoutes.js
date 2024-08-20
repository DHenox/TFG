const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Obtener usuario específico
router.get('/:userId', userController.getUser);

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener todos los proyectos en los que está involucrado un usuario
router.get('/:userId/projects', userController.getUserProjects);

// Obtener todos los proyectos creados por un usuario
router.get('/:userId/created-projects', userController.getUserCreatedProjects);

// Obtener todos los equipos de los que forma parte un usuario
router.get('/:userId/teams', userController.getUserTeams);

// Obtener todos los equipos creados por un usuario
router.get('/:userId/created-teams', userController.getUserCreatedTeams);

// Crear un nuevo usuario
router.post('/', userController.createUser);

// Actualizar un usuario existente
router.put('/:userId', userController.updateUser);

module.exports = router;
