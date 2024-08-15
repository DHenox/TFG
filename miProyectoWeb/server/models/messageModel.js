const pool = require('../config/database');

const Message = {
    create: ({ chatId, content, userId }) => {
        return pool.query(
            `
      INSERT INTO messages (chat_id, content, _timestamp, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
            [chatId, content, new Date(), userId]
        );
    },
    update: (messageId, { content }) => {
        return pool.query(
            `
      UPDATE messages
      SET content = $1
      WHERE id = $2
      RETURNING *
    `,
            [content, messageId]
        );
    },
    delete: (messageId) => {
        return pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [
            messageId,
        ]);
    },
};

module.exports = Message;
