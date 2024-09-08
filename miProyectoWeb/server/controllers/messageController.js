const Message = require('../models/messageModel');

// Crear un nuevo mensaje
exports.createMessage = async (req, res) => {
    try {
        const { chatId, content, userId } = req.body;
        const result = await Message.create({ chatId, content, userId });

        // Emitir el nuevo mensaje a todos los clientes conectados
        req.io.emit('newMessage', result.rows[0]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un mensaje existente
exports.updateMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const result = await Message.update(req.params.messageId, { content });
        if (result.rowCount > 0) {
            // Emitir el mensaje actualizado a todos los clientes conectados
            req.io.emit('updateMessage', result.rows[0]);

            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Mensaje no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un mensaje
exports.deleteMessage = async (req, res) => {
    try {
        const result = await Message.delete(req.params.messageId);
        if (result.rowCount > 0) {
            // Emitir el mensaje eliminado a todos los clientes conectados
            req.io.emit('deleteMessage', result.rows[0]);

            res.json({ message: 'Mensaje eliminado' });
        } else {
            res.status(404).json({ message: 'Mensaje no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
