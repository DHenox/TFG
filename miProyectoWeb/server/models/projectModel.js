const pool = require('../config/database');

const Project = {
    get: (projectId) => {
        return pool.query(
            `
      SELECT p.*
      FROM projects p
      WHERE p.id = $1
    `,
            [projectId]
        );
    },
    getTasks: (projectId) => {
        return pool.query(
            `
      SELECT *
      FROM tasks
      WHERE project_id = $1
    `,
            [projectId]
        );
    },
    getChats: (projectId) => {
        return pool.query(
            `
      SELECT *
      FROM chats
      WHERE project_id = $1
    `,
            [projectId]
        );
    },
    create: ({ name, description, userId, teamId }) => {
        return pool.query(
            `
      WITH inserted AS (
        INSERT INTO projects (name, description, created_at, user_id, team_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      )
      INSERT INTO user_project (user_id, project_id)
      VALUES ($4, (SELECT id FROM inserted))
      RETURNING *
    `,
            [name, description, new Date(), userId, teamId]
        );
    },
    update: (projectId, { name, description }) => {
        return pool.query(
            `
      UPDATE projects
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *
    `,
            [name, description, projectId]
        );
    },
    delete: (projectId) => {
        return pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [
            projectId,
        ]);
    },
};

module.exports = Project;
