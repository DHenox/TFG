const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// Obtener escaneo específico
router.get('/:taskId', scanController.getScan);

// Crear un nuevo escaneo
router.post('/tasks/:taskId', scanController.createScan);

// Eliminar un escaneo
router.delete('/:scanId', scanController.deleteScan);

module.exports = router;
