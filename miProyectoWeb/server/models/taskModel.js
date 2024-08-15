const pool = require('../config/database');

const Task = {
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
    create: ({
        projectId,
        type,
        name,
        description,
        status,
        startDate,
        endDate,
        userId,
    }) => {
        return pool.query(
            `
      INSERT INTO tasks (project_id, type, name, description, status, start_date, end_date, created_at, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
            [
                projectId,
                type,
                name,
                description,
                status,
                startDate,
                endDate,
                new Date(),
                userId,
            ]
        );
    },
    update: (
        taskId,
        { type, name, description, status, startDate, endDate }
    ) => {
        return pool.query(
            `
      UPDATE tasks
      SET type = $1, name = $2, description = $3, status = $4, start_date = $5, end_date = $6
      WHERE id = $7
      RETURNING *
    `,
            [type, name, description, status, startDate, endDate, taskId]
        );
    },
    delete: (taskId) => {
        return pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [
            taskId,
        ]);
    },
};

module.exports = Task;
