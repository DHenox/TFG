const Chat = require('../models/chatModel');

// Obtener un chat específico de un proyecto
exports.getChat = async (req, res) => {
    try {
        const result = await Chat.get(req.params.projectId, req.params.chatId);
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Chat no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener mensajes de un chat
exports.getChatMessages = async (req, res) => {
    try {
        const result = await Chat.getMessages(req.params.chatId);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo chat
exports.createChat = async (req, res) => {
    try {
        const { projectId, name } = req.body;
        const result = await Chat.create({ projectId, name });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un chat existente
exports.updateChat = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await Chat.update(req.params.chatId, { name });
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Chat no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un chat
exports.deleteChat = async (req, res) => {
    try {
        const result = await Chat.delete(req.params.chatId);
        if (result.rowCount > 0) {
            res.json({ message: 'Chat eliminado' });
        } else {
            res.status(404).json({ message: 'Chat no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
