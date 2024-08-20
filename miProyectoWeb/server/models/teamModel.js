// teamModel.js
const pool = require('../config/database');

const Team = {
    // Obtener un equipo específico
    get: (teamId) => {
        return pool.query(
            `
            SELECT *
            FROM teams
            WHERE id = $1
            `,
            [teamId]
        );
    },
    // Obtener usuarios de un equipo
    getUsers: (teamId) => {
        return pool.query(
            `
            SELECT u.*
            FROM users u
            INNER JOIN user_team ut ON u.id = ut.user_id
            WHERE ut.team_id = $1
            `,
            [teamId]
        );
    },
    // Crear un nuevo equipo
    create: async ({ name, description, userId, members }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insertar el equipo en la tabla teams
            const teamResult = await client.query(
                `INSERT INTO teams (name, description, user_id) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [name, description, userId]
            );

            const teamId = teamResult.rows[0].id;

            const userTeamValues = members
                .map((memberId) => `('${memberId}', ${teamId})`)
                .join(',');

            // Insertar las relaciones en la tabla user_team
            await client.query(
                `INSERT INTO user_team (user_id, team_id) 
                 VALUES ${userTeamValues}`
            );

            await client.query('COMMIT');
            return teamResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    // Actualizar un equipo existente
    update: async (teamId, { name, description, members }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Actualizar el equipo en la tabla teams
            const result = await client.query(
                `
                UPDATE teams
                SET name = $1, description = $2
                WHERE id = $3
                RETURNING *
                `,
                [name, description, teamId]
            );

            if (result.rowCount === 0) {
                throw new Error('Equipo no encontrado');
            }

            // Insertar las nuevas relaciones en user_team
            if (members && members.length > 0) {
                // Eliminar las relaciones antiguas en user_team
                await client.query(`DELETE FROM user_team WHERE team_id = $1`, [
                    teamId,
                ]);
                const userTeamValues = members
                    .map((member) => `('${member.id}', ${teamId})`)
                    .join(',');

                await client.query(
                    `INSERT INTO user_team (user_id, team_id) VALUES ${userTeamValues}`
                );
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
    // Eliminar un equipo
    delete: async (teamId) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Primero, eliminamos las relaciones en la tabla user_team
            await client.query(`DELETE FROM user_team WHERE team_id = $1`, [
                teamId,
            ]);

            // Luego, eliminamos el equipo en la tabla teams
            const result = await client.query(
                `DELETE FROM teams WHERE id = $1 RETURNING *`,
                [teamId]
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

module.exports = Team;
