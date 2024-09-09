const pool = require('../config/database');

const User = {
    getById: (userId) => {
        return pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    },
    getAll: () => {
        return pool.query('SELECT * FROM users');
    },
    getProjects: (userId) => {
        // Haz que se incluya un json con la lista de tareas de cada proyecto
        return pool.query(
            `
        SELECT
            p.*,
            json_agg(t.*) AS tasks,
            json_build_object(
                'id', tm.id,
                'name', tm.name,
                'description', tm.description,
                'user_id', tm.user_id
            ) AS team
        FROM
            projects p
        LEFT JOIN
            tasks t ON p.id = t.project_id
        LEFT JOIN
            teams tm ON p.team_id = tm.id
        WHERE
            p.user_id = $1
        GROUP BY
            p.id, tm.id;
        `,
            [userId]
        );
    },
    getCreatedProjects: (userId) => {
        return pool.query(
            `
      SELECT * FROM projects WHERE user_id = $1
    `,
            [userId]
        );
    },
    getTeams: (userId) => {
        return pool.query(
            `
      SELECT t.* FROM teams t JOIN user_team ut ON t.id = ut.team_id WHERE ut.user_id = $1
    `,
            [userId]
        );
    },
    getCreatedTeams: (userId) => {
        return pool.query(
            `
      SELECT * FROM teams WHERE user_id = $1
    `,
            [userId]
        );
    },
    create: (userData) => {
        return pool.query(
            'INSERT INTO users (id, name, email, picture, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                userData.sub,
                userData.name,
                userData.email,
                userData.picture,
                userData.role,
            ]
        );
    },
    update: (userId, userData) => {
        return pool.query(
            'UPDATE users SET name = $1, email = $2, picture = $3, role = $4 WHERE id = $5 RETURNING *',
            [
                userData.name,
                userData.email,
                userData.picture,
                userData.role,
                userId,
            ]
        );
    },
};

module.exports = User;
