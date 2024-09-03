const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// Obtener escanéo específico
router.get('/:taskId', scanController.getScan);

// Crear un nuevo escanéo
router.post('/tasks/:taskId', scanController.createScan);

// Eliminar un escanéo
router.delete('/:scanId', scanController.deleteScan);

module.exports = router;
