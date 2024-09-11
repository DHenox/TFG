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
                .map((member) => `('${member.id}', ${teamId})`)
                .join(',');

            // Insertar las relaciones en la tabla user_team
            await client.query(
                `INSERT INTO user_team (user_id, team_id) 
                 VALUES ${userTeamValues}`
            );

            await client.query('COMMIT');
            return teamResult;
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

            if (members && members.length > 0) {
                // ACTUALIZAR user_team
                const insertQuery = `
                    INSERT INTO user_team (user_id, team_id)
                    VALUES ($1, $2)
                    ON CONFLICT (user_id, team_id) DO NOTHING
                `;
                // Ejecutar la inserción en lote
                for (const member of members) {
                    await client.query(insertQuery, [member.id, teamId]);
                }
                // Eliminar los miembros que ya no están en la lista
                const memberIds = members.map((member) => member.id);
                await client.query(
                    `
                    DELETE FROM user_team
                    WHERE team_id = $1 AND user_id NOT IN (${memberIds
                        .map((_, i) => `$${i + 2}`)
                        .join(', ')})
                    `,
                    [teamId, ...memberIds]
                );

                // Obtener los ids de los proyectos en los que está involucrado el equipo
                const projectIds = (
                    await client.query(
                        `
                        SELECT id
                        FROM projects
                        WHERE team_id = $1
                        `,
                        [teamId]
                    )
                ).rows.map((row) => row.id);

                // ACTUALIZAR user_project
                const insertQueryProject = `
                    INSERT INTO user_project (user_id, project_id)
                    VALUES ($1, $2)
                    ON CONFLICT (user_id, project_id) DO NOTHING
                    `;

                for (const projectId of projectIds) {
                    // Ejecutar la inserción en lote
                    for (const member of members) {
                        await client.query(insertQueryProject, [
                            member.id,
                            projectId,
                        ]);
                    }
                    // Eliminar los miembros que ya no están en la lista
                    await client.query(
                        `
                    DELETE FROM user_project
                    WHERE project_id = $1 AND user_id NOT IN (${memberIds
                        .map((_, i) => `$${i + 2}`)
                        .join(', ')})
                    `,
                        [projectId, ...memberIds]
                    );
                }

                // Obtener los ids de las tareas del proyecto
                const taskIds = (
                    await client.query(
                        `
                        SELECT id
                        FROM tasks
                        WHERE project_id = ANY($1)
                        `,
                        [projectIds]
                    )
                ).rows.map((row) => row.id);

                // ActACTUALIZAR user_task
                for (const taskId of taskIds) {
                    // Desasignar las tareas de los miembros que ya no están en el equipo
                    await client.query(
                        `
                    DELETE FROM user_task
                    WHERE task_id = $1 AND user_id NOT IN (${memberIds
                        .map((_, i) => `$${i + 2}`)
                        .join(', ')})
                    `,
                        [taskId, ...memberIds]
                    );
                }
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
    // Eliminar un equipo
    delete: async (teamId) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

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
