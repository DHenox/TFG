const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Obtener un proyecto específico
router.get('/:projectId', projectController.getProject);

// Obtener tareas de un proyecto
router.get('/:projectId/tasks', projectController.getProjectTasks);

// Obtener chats de un proyecto
router.get('/:projectId/chats', projectController.getProjectChats);

// Obtener usuarios de un proyecto
router.get('/:projectId/users', projectController.getProjectUsers);

// Crear scan de un proyecto
router.post('/:projectId/scans', projectController.createProjectScan);

// Crear un nuevo proyecto
router.post('/', projectController.createProject);

// Actualizar un proyecto existente
router.put('/:projectId', projectController.updateProject);

// Eliminar un proyecto
router.delete('/:projectId', projectController.deleteProject);

module.exports = router;
