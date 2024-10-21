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
            -- Aquí unimos la tabla User_Project para ver en qué proyectos está el usuario
            JOIN
                user_project up ON p.id = up.project_id
            WHERE
                up.user_id = $1 -- Filtramos por el usuario que esté involucrado en el proyecto
            GROUP BY
                p.id, tm.id;
            `,
            [userId]
        );
    },
    getTeams: (userId) => {
        return pool.query(
            `
            SELECT
            t.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', u.id,
                        'name', u.name,
                        'email', u.email,
                        'picture', u.picture,
                        'role', u.role
                    )
                ) FILTER (WHERE u.id IS NOT NULL), '[]'
            ) AS members
            FROM teams t
            JOIN user_team ut ON t.id = ut.team_id
            LEFT JOIN user_team ut_all ON t.id = ut_all.team_id
            LEFT JOIN users u ON u.id = ut_all.user_id
            WHERE ut.user_id = $1
            GROUP BY t.id
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
