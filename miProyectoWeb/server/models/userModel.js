const pool = require('../config/database');

const User = {
    getById: (userId) => {
        return pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    },
    getAll: () => {
        return pool.query('SELECT * FROM users');
    },
    create: (userData) => {
        return pool.query(
            'INSERT INTO users (id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [userData.sub, userData.name, userData.email, userData.role]
        );
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
};

module.exports = User;
