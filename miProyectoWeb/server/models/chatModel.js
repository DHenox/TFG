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
            SELECT 
                m.id, 
                m.content, 
                m._timestamp, 
                json_build_object(
                    'id', u.id, 
                    'name', u.name, 
                    'picture', u.picture
                ) as user
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.chat_id = $1
            ORDER BY m._timestamp ASC
            `,
            [chatId]
        );
    },
    create: async ({ projectId, name }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const chatResult = await client.query(
                `
                INSERT INTO chats (name, project_id, created_at)
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [name, projectId, new Date()]
            );

            await client.query('COMMIT');
            return chatResult;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
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
