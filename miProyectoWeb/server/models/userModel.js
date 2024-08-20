const pool = require('../config/database');

const User = {
    getById: (userId) => {
        return pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    },
    getAll: () => {
        return pool.query('SELECT * FROM users');
    },
    getProjects: (userId) => {
        return pool.query(
            `
      SELECT p.* FROM projects p JOIN user_project up ON p.id = up.project_id WHERE up.user_id = $1
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
