const pool = require('../config/database');

const Task = {
    // Obtener una tarea específica
    get: (taskId) => {
        return pool.query(
            `
      SELECT t.*
      FROM tasks t
      WHERE t.id = $1
    `,
            [taskId]
        );
    },
    // Crear una nueva tarea
    create: async ({
        projectId,
        type,
        name,
        description,
        status,
        startDate,
        endDate,
        userId, // Usuario creador
        assignedUsers, // Lista de usuarios asignados
    }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insertar la tarea en la tabla tasks
            const taskResult = await client.query(
                `
                INSERT INTO tasks (type, name, description, status, start_date, end_date, created_at, user_id, project_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
                `,
                [
                    type,
                    name,
                    description,
                    status,
                    startDate,
                    endDate,
                    new Date(),
                    userId,
                    projectId,
                ]
            );

            const taskId = taskResult.rows[0].id;

            if (assignedUsers && assignedUsers.length > 0) {
                // Insertar las relaciones en la tabla user_tasks
                const userTaskValues = assignedUsers
                    .map((userId) => `('${userId}', ${taskId})`)
                    .join(',');

                await client.query(
                    `INSERT INTO user_task (user_id, task_id) 
                     VALUES ${userTaskValues}`
                );
            }

            await client.query('COMMIT');
            return taskResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    // Actualizar una tarea existente
    update: async (
        taskId,
        { type, name, description, status, startDate, endDate, assignedUsers }
    ) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Actualizar la tarea en la tabla tasks
            const result = await client.query(
                `
                UPDATE tasks
                SET type = $1, name = $2, description = $3, status = $4, start_date = $5, end_date = $6
                WHERE id = $7
                RETURNING *
                `,
                [type, name, description, status, startDate, endDate, taskId]
            );

            // Eliminar las relaciones antiguas en user_tasks
            await client.query(`DELETE FROM user_task WHERE task_id = $1`, [
                taskId,
            ]);
            if (assignedUsers && assignedUsers.length > 0) {
                // Insertar las nuevas relaciones en user_tasks
                const userTaskValues = assignedUsers
                    .map((user) => `('${user.id}', ${taskId})`)
                    .join(',');

                await client.query(
                    `INSERT INTO user_task (user_id, task_id) 
                     VALUES ${userTaskValues}`
                );
            }

            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    // Eliminar una tarea
    delete: async (taskId) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Primero, eliminamos las relaciones en la tabla user_tasks
            await client.query(`DELETE FROM user_tasks WHERE task_id = $1`, [
                taskId,
            ]);

            // Luego, eliminamos la tarea en la tabla tasks
            const result = await client.query(
                `DELETE FROM tasks WHERE id = $1 RETURNING *`,
                [taskId]
            );

            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};

module.exports = Task;
