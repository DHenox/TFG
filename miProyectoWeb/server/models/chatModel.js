const pool = require('../config/database');

const Chat = {
    get: (projectId, chatId) => {
        return pool.query(
            `
      SELECT c.*
      FROM chats c
      WHERE c.project_id = $1 AND c.id = $2
    `,
            [projectId, chatId]
        );
    },
    getMessages: (chatId) => {
        return pool.query(
            `
      SELECT m.*
      FROM messages m
      WHERE m.chat_id = $1
    `,
            [chatId]
        );
    },
    create: ({ projectId, name }) => {
        return pool.query(
            `
      INSERT INTO chats (project_id, name, created_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
            [projectId, name, new Date()]
        );
    },
    update: (chatId, { name }) => {
        return pool.query(
            `
      UPDATE chats
      SET name = $1
      WHERE id = $2
      RETURNING *
    `,
            [name, chatId]
        );
    },
    delete: (chatId) => {
        return pool.query('DELETE FROM chats WHERE id = $1 RETURNING *', [
            chatId,
        ]);
    },
};

module.exports = Chat;
