const pool = require('../config/database');

const Message = {
    create: async ({ chatId, content, userId }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const messageResult = await client.query(
                `
                INSERT INTO messages (chat_id, content, _timestamp, user_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `,
                [chatId, content, new Date(), userId]
            );

            // Añadir la info completa del usuario que envió el mensaje como objeto
            const userResult = await client.query(
                `
                SELECT id, name, picture
                FROM users
                WHERE id = $1
                `,
                [userId]
            );
            messageResult.rows[0].user = userResult.rows[0];

            await client.query('COMMIT');
            return messageResult;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    update: async (messageId, { content }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const messageResult = await client.query(
                `
                UPDATE messages
                SET content = $1
                WHERE id = $2
                RETURNING *
                `,
                [content, messageId]
            );

            // Añadir la info completa del usuario que envió el mensaje como objeto
            const userResult = await client.query(
                `
                SELECT id, name, picture
                FROM users
                WHERE id = $1
                `,
                [messageResult.rows[0].user_id]
            );
            messageResult.rows[0].user = userResult.rows[0];

            await client.query('COMMIT');
            return messageResult;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    delete: (messageId) => {
        return pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [
            messageId,
        ]);
    },
};

module.exports = Message;
