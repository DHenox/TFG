const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Crear un nuevo mensaje
router.post('/', messageController.createMessage);

// Actualizar un mensaje existente
router.put('/:messageId', messageController.updateMessage);

// Eliminar un mensaje
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
