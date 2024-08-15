const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Obtener una tarea específica
router.get('/:taskId', taskController.getTask);

// Crear una nueva tarea
router.post('/', taskController.createTask);

// Actualizar una tarea existente
router.put('/:taskId', taskController.updateTask);

// Eliminar una tarea
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
