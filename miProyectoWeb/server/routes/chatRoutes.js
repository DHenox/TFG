const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Obtener un chat específico de un proyecto
router.get('/:chatId', chatController.getChat);

// Obtener mensajes de un chat
router.get('/:chatId/messages', chatController.getChatMessages);

// Crear un nuevo chat
router.post('/', chatController.createChat);

// Actualizar un chat existente
router.put('/:chatId', chatController.updateChat);

// Eliminar un chat
router.delete('/:chatId', chatController.deleteChat);

module.exports = router;
